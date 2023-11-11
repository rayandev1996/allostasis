import {
  AllostasisConstructor,
  Chain,
  Chat,
  ChatMessage,
  Communities,
  Profile,
  ProfileTypeBasedOnCommunities,
  Post, PostLike, PostComment
} from './types/allostasis';
import { GreeniaProfile } from './types/greenia';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { definition } from './constants/definition';
import { RuntimeCompositeDefinition } from '@composedb/types';
import { Store } from './utils/store';
import { getAddressFromDid, getAuthMethod } from './utils/did-provider';
import { DIDSession } from 'did-session';
import { Web3Provider } from '@ethersproject/providers';
import { ethConnect } from '@lit-protocol/auth-browser';
import _ from 'lodash';
import dayjs from 'dayjs';
import {
  chatMessageAccessControlGenerator,
  decodeB64,
  encryptString,
  getAuthSig
} from './utils/lit';
import { create as createIPFS, IPFSHTTPClient } from 'kubo-rpc-client';
import { MyBlobToBuffer } from './utils/file';
import { ethers } from 'ethers';
import * as PushAPI from '@pushprotocol/restapi';
import {
  IFeeds,
  IMessageIPFS,
  IUser,
  Message,
  MessageWithCID,
  SignerType
} from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';

export default class Allostasis<
  TCommunity extends keyof Communities = keyof Communities
> {
  private community: TCommunity;
  private nodeURL: string;
  public provider: any;
  public chain: Chain;
  public ceramic: CeramicClient;
  public composeClient: ComposeClient;
  public lit: LitNodeClient;
  public ipfs: IPFSHTTPClient;
  public ethersProvider: Web3Provider;
  public ethersSigner: SignerType;
  public ethersAddress: string;
  public chatUser: IUser;
  public pvtKey: any;

  constructor(community: TCommunity, options: AllostasisConstructor) {
    this.nodeURL = options.nodeURL;
    this.community = community;

    if (options.chain) {
      this.chain = options.chain;
    } else {
      this.chain = { name: 'mumbai', id: 80001 };
    }

    if (!options.provider) {
      if (window.ethereum) {
        this.provider = window.ethereum;
      } else {
        console.log(
          'Allostasis',
          'An ethereum provider is required to proceed with the connection to Ceramic.'
        );
      }
    } else {
      this.provider = options.provider;
    }

    this.ceramic = new CeramicClient(options.nodeURL);

    this.composeClient = new ComposeClient({
      ceramic: options.nodeURL,
      definition: definition as RuntimeCompositeDefinition
    });

    this.lit = new LitJsSdk.LitNodeClient({
      alertWhenUnauthorized: false,
      debug: false
    });

    this.ipfs = createIPFS({
      url: _.get(options, 'infura.url', ''),
      headers: {
        authorization:
          'Basic ' +
          btoa(
            _.get(options, 'infura.projectId', '') +
              ':' +
              _.get(options, 'infura.apiKey', '')
          )
      }
    });

    this.ethersProvider = new ethers.providers.Web3Provider(this.provider);
  }

  async connect(): Promise<{ did: any; address: string }> {
    return new Promise((resolve, reject) => {
      (async () => {
        const store = new Store();
        await this.lit.connect();

        try {
          await this.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${this.chain.id.toString(16)}` }]
          });

          const { authMethod, address } = await getAuthMethod(
            this.provider,
            this.chain
          );

          if (authMethod != null) {
            const session = await DIDSession.authorize(authMethod, {
              resources: this.composeClient.resources
            });

            const sessionString = session.serialize();
            await store.setItem('ceramic-session', sessionString);

            const _userAuthSig = await store.getItem(
              'lit-auth-signature-' + address
            );
            if (_userAuthSig) {
              await store.setItem('lit-auth-signature', _userAuthSig);
            }

            if (
              !_userAuthSig ||
              _userAuthSig == '' ||
              _userAuthSig == undefined
            ) {
              const web3 = new Web3Provider(this.provider);
              const { chainId } = await web3.getNetwork();

              await ethConnect.signAndSaveAuthMessage({
                web3,
                account: address,
                chainId,
                resources: null,
                expiration: new Date(
                  Date.now() + 1000 * 60 * 60 * 24
                ).toISOString()
              });

              const _authSig = await store.getItem('lit-auth-signature');
              const authSig = JSON.parse(_authSig ?? '');
              if (authSig && authSig != '') {
                await store.setItem(
                  'lit-auth-signature-' + address,
                  JSON.stringify(authSig)
                );
              }
            }

            this.ethersProvider
              .send('eth_requestAccounts', [])
              .then(async () => {
                await this.ceramic.setDID(session.did);
                this.composeClient.setDID(session.did);

                this.ethersSigner = this.ethersProvider.getSigner();
                this.ethersAddress = address;

                console.log('Allostasis', 'Getting user');

                const gotUser = await PushAPI.user.get({
                  account: this.ethersAddress,
                  env: ENV.STAGING
                });

                console.log('Allostasis', gotUser);

                if (gotUser) {
                  this.chatUser = gotUser;
                } else {
                  const createUser = await PushAPI.user.create({
                    account: this.ethersAddress,
                    env: ENV.STAGING
                  });

                  console.log('Allostasis', 'Creating user');
                  console.log('Allostasis', createUser);

                  this.chatUser = createUser;
                }

                this.pvtKey = await PushAPI.chat.decryptPGPKey({
                  encryptedPGPPrivateKey: this.chatUser.encryptedPrivateKey,
                  account: this.ethersAddress,
                  signer: this.ethersSigner,
                  env: ENV.STAGING,
                  toUpgrade: true
                });

                resolve({ did: session.did.id, address: address ?? '' });
              })
              .catch((e) => {
                store.removeItem('ceramic-session');
                store.removeItem('lit-auth-signature-' + address);
                store.removeItem('lit-auth-signature');

                reject(e);
              });
          } else {
            reject('Getting auth method failed');
          }
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  async disconnect(address?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      (async () => {
        const store = new Store();

        try {
          await store.removeItem('ceramic-session');
          await store.removeItem('ceramic:auth_type');
          await store.removeItem('lit-web3-provider');
          await store.removeItem('lit-comms-keypair');
          await store.removeItem('lit-auth-signature');
          await store.removeItem(`lit-auth-signature-${address ?? ''}`);

          resolve(true);
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  async isConnected(): Promise<{ did: any; address: string }> {
    return new Promise((resolve, reject) => {
      (async () => {
        await this.ceramic;
        const store = new Store();
        await this.lit.connect();

        const sessionString = await store.getItem('ceramic-session');

        /** Connect to Ceramic using the session previously stored */
        try {
          const session = await DIDSession.fromSession(sessionString ?? '');

          const { address } = getAddressFromDid(session.id);

          const _userAuthSig = await store.getItem(
            'lit-auth-signature-' + address
          );
          if (_userAuthSig) {
            await store.setItem('lit-auth-signature', _userAuthSig);
          }

          this.ethersProvider
            .send('eth_requestAccounts', [])
            .then(async () => {
              await this.ceramic.setDID(session.did);
              this.composeClient.setDID(session.did);

              this.ethersSigner = this.ethersProvider.getSigner();
              this.ethersAddress = address;

              console.log('Allostasis', 'Getting user');

              const gotUser = await PushAPI.user.get({
                account: this.ethersAddress,
                env: ENV.STAGING
              });

              console.log('Allostasis', gotUser);

              if (gotUser) {
                this.chatUser = gotUser;
              } else {
                const createUser = await PushAPI.user.create({
                  account: this.ethersAddress,
                  env: ENV.STAGING
                });

                console.log('Allostasis', 'Creating user');
                console.log('Allostasis', createUser);

                this.chatUser = createUser;
              }

              this.pvtKey = await PushAPI.chat.decryptPGPKey({
                encryptedPGPPrivateKey: this.chatUser.encryptedPrivateKey,
                account: this.ethersAddress,
                signer: this.ethersSigner,
                env: ENV.STAGING,
                toUpgrade: true
              });

              resolve({ did: session.did.id, address: address ?? '' });
            })
            .catch((e) => {
              store.removeItem('ceramic-session');
              store.removeItem('lit-auth-signature-' + address);
              store.removeItem('lit-auth-signature');

              reject(e);
            });
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  async createOrUpdateProfile(
    params: ProfileTypeBasedOnCommunities<TCommunity>
  ): Promise<ProfileTypeBasedOnCommunities<TCommunity>> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const create = await this.composeClient.executeQuery<{
            createProfile: { document: Profile };
          }>(`
            mutation {
              createProfile(input: {
                content: {
                  ${Object.keys(params)
                    .filter(
                      (x) =>
                        x === 'displayName' ||
                        x === 'email' ||
                        x === 'avatar' ||
                        x === 'cover' ||
                        x === 'bio' ||
                        x === 'accountType' ||
                        x === 'age' ||
                        x === 'skills' ||
                        x === 'gender' ||
                        x === 'phoneNumber' ||
                        x === 'address' ||
                        x === 'socialLinks'
                    )
                    .map((key) => {
                      if (key === 'skills') {
                        return `${key}: [${params[key]
                          .map((i) => `"${i}"`)
                          .join(',')}]`;
                      } else if (key === 'socialLinks') {
                        return `${key}: [${params[key]
                          .map((i) => `"${i}"`)
                          .join(',')}]`;
                      } else {
                        return `${key}: "${params[key]}"`;
                      }
                    })
                    .join(',')}
                }
              })
              {
                document {
                  id
                  displayName
                  email
                  avatar
                  cover
                  bio
                  accountType
                  age
                  skills
                  gender
                  phoneNumber
                  address
                  socialLinks
                }
              }
            }
          `);

          if (create.errors != null && create.errors.length > 0) {
            reject(create);
          } else {
            switch (this.community) {
              case 'greenia':
                const createGreenia = await this.composeClient.executeQuery<{
                  createGreeniaProfile: { document: GreeniaProfile };
                }>(`
                  mutation {
                    createGreeniaProfile(input: {
                      content: {
                        profileID: "${create.data.createProfile.document.id}",
                        ${Object.keys(params)
                          .filter((x) => x === 'greeniaRelatedProperty')
                          .map((key) => {
                            return `${key}: "${params[key]}"`;
                          })
                          .join(',')}
                      }
                    })
                    {
                      document {
                        id
                      }
                    }
                  }
                `);

                if (
                  createGreenia.errors != null &&
                  createGreenia.errors.length > 0
                ) {
                  reject(createGreenia);
                } else {
                  resolve({
                    ...create.data.createProfile.document,
                    ...createGreenia.data.createGreeniaProfile.document,
                    id: create.data.createProfile.document.id,
                    greeniaProfileId:
                      createGreenia.data.createGreeniaProfile.document.id
                  } as GreeniaProfile);
                }
                break;
              default:
                reject('Wrong community');
            }
          }
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  async getProfile(): Promise<ProfileTypeBasedOnCommunities<TCommunity>> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const profile = await this.composeClient.executeQuery<{
            viewer: { profile: Profile };
          }>(`
            query {
              viewer {
                profile {
                  id
                  displayName
                  email
                  avatar
                  cover
                  bio
                  accountType
                  age
                  skills
                  gender
                  phoneNumber
                  address
                  socialLinks
                  experiences(last: 300) {
                    edges {
                      node {
                        id
                        city
                        title
                        company
                        endDate
                        startDate
                        description
                        isDeleted
                      }
                    }
                  }
                  educations(last: 300) {
                    edges {
                      node {
                        id
                        city
                        title
                        school
                        endDate
                        startDate
                        description
                        isDeleted
                      }
                    }
                  }
                  posts(last: 300) {
                    edges {
                      node {
                        id
                        body
                        isDeleted
                        isEncrypted
                        tags
                        attachment
                        externalURL
                        encryptedSymmetricKey
                        unifiedAccessControlConditions
                        commentsCount
                        likesCount
                      }
                    }
                  }
                  chats(last: 300) {
                    edges {
                      node {
                        id
                        createdAt
                        isDeleted
                        profileID
                        profile {
                          id
                          name
                          avatar
                        }
                        recipientProfileID
                        recipientProfile {
                          id
                          name
                          avatar
                        }
                      }
                    }
                  }
                  receivedChats(last: 300) {
                    edges {
                      node {
                        id
                        createdAt
                        isDeleted
                        profileID
                        profile {
                          id
                          name
                          avatar
                        }
                        recipientProfileID
                        recipientProfile {
                          id
                          name
                          avatar
                        }
                      }
                    }
                  }
                }
              }
            }
          `);

          if (profile.errors != null && profile.errors.length > 0) {
            reject(profile);
          } else {
            if (profile.data?.viewer?.profile != null) {
              const profileData = {
                ...profile.data?.viewer?.profile,
                chats: _.get(
                  profile.data.viewer.profile,
                  'chats.edges',
                  []
                ).map((i: { node: any }) => i.node),
                receivedChats: _.get(
                  profile.data.viewer.profile,
                  'receivedChats.edges',
                  []
                ).map((i: { node: any }) => i.node),
                educations: _.get(
                  profile.data.viewer.profile,
                  'educations.edges',
                  []
                ).map((i: { node: any }) => i.node),
                experiences: _.get(
                  profile.data.viewer.profile,
                  'experiences.edges',
                  []
                ).map((i: { node: any }) => i.node),
                posts: _.get(
                  profile.data.viewer.profile,
                  'posts.edges',
                  []
                ).map((i: { node: any }) => i.node)
              };

              switch (this.community) {
                case 'greenia':
                  const greeniaProfile = await this.composeClient.executeQuery<{
                    viewer: { greeniaProfile: GreeniaProfile };
                  }>(`
                    query {
                      viewer {
                        greeniaProfile {
                          id
                        }
                      }
                    }
                  `);

                  if (
                    greeniaProfile.errors != null &&
                    greeniaProfile.errors.length > 0
                  ) {
                    reject(greeniaProfile);
                  } else {
                    if (greeniaProfile.data?.viewer?.greeniaProfile != null) {
                      resolve({
                        ...profileData,
                        ...greeniaProfile.data?.viewer?.greeniaProfile,
                        id: profileData.id,
                        greeniaProfileId:
                          greeniaProfile.data?.viewer?.greeniaProfile.id
                      } as GreeniaProfile);
                    } else {
                      reject(greeniaProfile);
                    }
                  }
                  break;
                default:
                  reject('Wrong community');
              }
            } else {
              reject(profile);
            }
          }
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  async getUserProfile(id: string): Promise<Profile> {
    return new Promise((resolve, reject) => {
      (async () => {
        const profile = await this.composeClient.executeQuery<{
          node: Profile & {
            chats: { edges: { node: Chat }[] };
            receivedChats: { edges: { node: Chat }[] };
          };
        }>(`
          query {
            node(id: "${id}") {
              ... on Profile {
                id
                displayName
                email
                avatar
                cover
                bio
                accountType
                age
                skills
                gender
                phoneNumber
                address
                socialLinks
                experiences(last: 300) {
                  edges {
                    node {
                      id
                      city
                      title
                      company
                      endDate
                      startDate
                      description
                      isDeleted
                    }
                  }
                }
                educations(last: 300) {
                  edges {
                    node {
                      id
                      city
                      title
                      school
                      endDate
                      startDate
                      description
                      isDeleted
                    }
                  }
                }
                posts(last: 300) {
                  edges {
                    node {
                      id
                      body
                      isDeleted
                      isEncrypted
                      tags
                      attachment
                      externalURL
                      encryptedSymmetricKey
                      unifiedAccessControlConditions
                      commentsCount
                      likesCount
                    }
                  }
                }
                chats(last: 300) {
                  edges {
                    node {
                      id
                      createdAt
                      isDeleted
                      profileID
                      profile {
                        id
                        name
                        avatar
                      }
                      recipientProfileID
                      recipientProfile {
                        id
                        name
                        avatar
                      }
                    }
                  }
                }
                receivedChats(last: 300) {
                  edges {
                    node {
                      id
                      createdAt
                      isDeleted
                      profileID
                      profile {
                        id
                        name
                        avatar
                      }
                      recipientProfileID
                      recipientProfile {
                        id
                        name
                        avatar
                      }
                    }
                  }
                }
              }
            }
          }
        `);

        if (profile.errors != null && profile.errors.length > 0) {
          reject(profile);
        } else {
          resolve({
            ...profile.data.node,
            chats: _.get(profile.data.node.chats, 'edges', []).map(
              (i: { node: any }) => i.node
            ),
            receivedChats: _.get(
              profile.data.node.receivedChats,
              'edges',
              []
            ).map((i: { node: any }) => i.node)
          });
        }
      })();
    });
  }

  async getCommunityUserProfile(
    id: string
  ): Promise<ProfileTypeBasedOnCommunities<TCommunity>> {
    return new Promise((resolve, reject) => {
      (async () => {
        switch (this.community) {
          case 'greenia':
            const greeniaProfile = await this.composeClient.executeQuery<{
              node: GreeniaProfile;
            }>(`
              query {
                node(id: "${id}") {
                  ... on GreeniaProfile {
                    id
                  }
                }
              }
            `);

            if (
              greeniaProfile.errors != null &&
              greeniaProfile.errors.length > 0
            ) {
              reject(greeniaProfile);
            } else {
              const { id, ...rest } = greeniaProfile.data.node;

              resolve({
                ...rest,
                greeniaProfileId: greeniaProfile.data.node.id
              } as GreeniaProfile);
            }
            break;
          default:
            reject('Wrong Community');
        }
      })();
    });
  }

  async getChats(): Promise<IFeeds[]> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // resolve(this.chatUser.chat.list("CHATS"));
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  async createChat(recipient: string): Promise<MessageWithCID> {
    return new Promise((resolve, reject) => {
      // this.chatUser.chat.send(recipient, {
      //   type: 'Text',
      //   content: 'Hi! I want to chat with  you.'
      // }).then(res => {
      //   resolve(res)
      // }).catch(err => {
      //   reject(err)
      // })
    });
  }

  async getChatHistory(recipient: string): Promise<IMessageIPFS[]> {
    return new Promise((resolve, reject) => {
      // this.chatUser.chat.history(recipient).then(res => {
      //   resolve(res)
      // }).catch(err => {
      //   reject(err)
      // })
    });
  }

  async sendChatMessage(
    recipient: string,
    message: Message
  ): Promise<MessageWithCID> {
    return new Promise((resolve, reject) => {
      // return this.chatUser.chat.send(recipient, message).then(res => {
      //   resolve(res)
      // }).catch(err => {
      //   reject(err)
      // })
    });
  }

  async sendChatMessageFile(
    file: Blob,
    chatId: string,
    profileId: string,
    userAddress: string,
    recipientAddress: string
  ): Promise<ChatMessage> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          MyBlobToBuffer(file, async (err, buff) => {
            if (err) {
              reject(err);
            } else {
              let upload;

              if (buff != null) {
                upload = await this.ipfs?.add(buff);
              }

              const filePath = upload?.path ?? '';

              const encryption = await encryptString(
                filePath,
                chatMessageAccessControlGenerator(
                  userAddress,
                  recipientAddress
                ),
                this.chain,
                this.lit
              );

              if (encryption) {
                const message = await this.composeClient.executeQuery<{
                  createChatMessage: { document: ChatMessage };
                }>(`
                  mutation {
                    createChatMessage(input: {
                      content: {
                        messageType: "file",
                        chatID: "${chatId}",
                        profileID: "${profileId}",
                        createdAt: "${dayjs().toISOString()}",
                        body: "${encryption.encryptedContent}",
                        unifiedAccessControlConditions: "${
                          encryption.unifiedAccessControlConditions
                        }",
                        encryptedSymmetricKey: "${
                          encryption.encryptedSymmetricKey
                        }"
                      }
                    })
                    {
                      document {
                        messageType
                        id
                        profileID
                        profile {
                          id
                          name
                          avatar
                        }
                        body
                        unifiedAccessControlConditions
                        encryptedSymmetricKey
                      }
                    }
                  }
                `);

                if (message.errors != null && message.errors.length > 0) {
                  reject(message);
                } else {
                  resolve(message.data.createChatMessage.document);
                }
              } else {
                reject('Cannot encrypt message');
              }
            }
          });
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  async decryptContent(
    content: string,
    unifiedAccessControlConditions: string,
    encryptedSymmetricKey: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const store = new Store();
          const authSig = await getAuthSig(store);
          const decodedString = decodeB64(content);
          const _access = JSON.parse(atob(unifiedAccessControlConditions));
          const decryptedSymmetricKey = await this.lit.getEncryptionKey({
            unifiedAccessControlConditions: _access,
            toDecrypt: encryptedSymmetricKey,
            chain: `${this.chain.id}`,
            authSig
          });
          const _blob = new Blob([decodedString]);
          const decryptedString = await LitJsSdk.decryptString(
            _blob,
            decryptedSymmetricKey
          );

          resolve(decryptedString);
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  async createPost(params: {
    body: string;
    shortDescription?: string;
    tags?: string[];
    attachment?: string;
    externalURL?: string;
    isEncrypted?: boolean;
    profileID: string;
  }): Promise<Post> {
    return new Promise(async (resolve, reject) => {
      try {
        const create = await this.composeClient.executeQuery<{
          createPost: { document: Post };
        }>(`
            mutation {
              createPost(input: {
                content: {
                  body: "${params.body}",
                  shortDescription: "${params.shortDescription}",
                  profileID: "${params.profileID}",
                  attachment: "${params.attachment}",
                  externalURL: "${params.externalURL}",
                  isEncrypted: ${params.isEncrypted},
                  tags: [${params.tags.map((i) => `"${i}"`).join(',')}],
                  createdAt: "${dayjs().toISOString()}",
                  isDeleted: false
                }
              })
              {
                document {
                  id
                  body
                  shortDescription
                  profileID
                  attachment
                  externalURL
                  isEncrypted
                  tags
                  createdAt
                  isDeleted
                  unifiedAccessControlConditions
                  encryptedSymmetricKey
                }
              }
            }
          `);

        if (create.errors != null && create.errors.length > 0) {
          reject(create);
        } else {
          resolve({
            ...create.data.createPost.document
          } as Post);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  async updatePost(params: {
    id: string;
    body: string;
    shortDescription?: string;
    tags?: string[];
    attachment?: string;
    externalURL?: string;
    isEncrypted?: boolean;
    unifiedAccessControlConditions?: boolean;
    encryptedSymmetricKey?: boolean;
    profileID: string;
  }): Promise<Post> {
    return new Promise(async (resolve, reject) => {
      try {
        const update = await this.composeClient.executeQuery<{
          updatePost: { document: Post };
        }>(`
            mutation {
              updatePost(input: {
                id: "${params.id}",
                content: {
                  body: "${params.body}",
                  shortDescription: "${params.shortDescription}",
                  profileID: "${params.profileID}",
                  attachment: "${params.attachment}",
                  externalURL: "${params.externalURL}",
                  isEncrypted: ${params.isEncrypted},
                  unifiedAccessControlConditions: "${
                    params.unifiedAccessControlConditions
                  }",
                  encryptedSymmetricKey: "${params.encryptedSymmetricKey}",
                  tags: [${params.tags.map((i) => `"${i}"`).join(',')}],
                  createdAt: "${dayjs().toISOString()}",
                  isDeleted: false
                }
              })
              {
                document {
                  id
                  body
                  shortDescription
                  profileID
                  attachment
                  externalURL
                  isEncrypted
                  tags
                  createdAt
                  isDeleted
                  unifiedAccessControlConditions
                  encryptedSymmetricKey
                }
              }
            }
          `);

        if (update.errors != null && update.errors.length > 0) {
          reject(update);
        } else {
          resolve({
            ...update.data.updatePost.document
          } as Post);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  async getPosts(params: {
    numberPerPage: number;
    cursor: string;
  }): Promise<{ posts: Post[]; cursor: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.composeClient.executeQuery<{
          postIndex: { edges: { node: Post; cursor: string }[] };
        }>(`
            mutation {
              postIndex(first: ${params.numberPerPage} after: "${params.cursor}") {
                edges {
                  node {
                    id
                    body
                    shortDescription
                    profileID
                    attachment
                    externalURL
                    isEncrypted
                    tags
                    createdAt
                    isDeleted
                    unifiedAccessControlConditions
                    encryptedSymmetricKey
                    profile {
                      id
                      displayName
                      avatar
                      postsCount
                      followersCount
                      followingsCount
                    }
                    commentsCount
                    comments(last: 500) {
                      edges {
                        node {
                          id
                          content
                          replyingToID
                          isDeleted
                          profileID
                          profile {
                            id
                            displayName
                            avatar
                          }
                        }
                      }
                    }
                    likesCount
                    likes(last: 500) {
                      edges {
                        node {
                          id
                          isDeleted
                          profileID
                          profile {
                            id
                            displayName
                            avatar
                          }
                        }
                      }
                    }
                  }
                  cursor
                }
              }
            }
          `);

        if (list.errors != null && list.errors.length > 0) {
          reject(list);
        } else {
          resolve({
            posts: list.data.postIndex.edges.map((x) => ({
              ...x.node,
              likes: _.get(x.node, 'likes.edges', []).map(
                  (x: { node: PostLike }) => x.node
              ),
              comments: _.get(x.node, 'comments.edges', []).map(
                  (x: { node: PostComment }) => x.node
              )
            })),
            cursor: list.data?.postIndex?.edges.at(-1)?.cursor ?? ''
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
