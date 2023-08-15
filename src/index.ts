import {
  AllostasisConstructor,
  Chain,
  Chat,
  ChatMessage,
  Communities,
  Profile,
  ProfileTypeBasedOnCommunities
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
import { chatMessageAccessControlGenerator, encryptString } from './utils/lit';

export default class Allostasis {
  private community: keyof Communities;
  private nodeURL: string;
  private provider: any;
  private chain: Chain;
  private ceramic: CeramicClient;
  private composeClient: ComposeClient;
  private lit: LitNodeClient;

  constructor(community: keyof Communities, options: AllostasisConstructor) {
    this.nodeURL = options.nodeURL;
    this.community = community;

    if (options.chain) {
      this.chain = options.chain;
    } else {
      this.chain = { name: 'mumbai', code: 80001 };
    }

    if (!options.provider) {
      if (window.ethereum) {
        this.provider = window.ethereum;
      } else {
        console.log(
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
  }

  async connect(): Promise<{ did: any; address: string }> {
    return new Promise((resolve, reject) => {
      (async () => {
        const store = new Store();
        await this.lit.connect();

        try {
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

            this.ceramic.did = session.did;
            this.composeClient.setDID(session.did);

            resolve({ did: session.did, address: address ?? '' });
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

          this.ceramic.did = session.did;
          this.composeClient.setDID(session.did);

          resolve({ did: session.did, address: address ?? '' });
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  async createOrUpdateProfile<T extends typeof this.community>(
    params: ProfileTypeBasedOnCommunities<T>
  ): Promise<ProfileTypeBasedOnCommunities<T>> {
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
                      (x) => x === 'name' || x === 'email' || x === 'avatar'
                    )
                    .map((key) => {
                      return `${key}: "${params[key]}"`;
                    })
                    .join(',')}
                }
              })
              {
                document {
                  id
                  name
                  email
                  avatar
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
                      content:{
                        profileID: "${create.data.createProfile.document.id}",
                        ${Object.keys(params)
                          .filter(
                            (x) =>
                              x === 'cover' || x === 'bio' || x === 'skills'
                          )
                          .map((key) => {
                            if (key === 'skills') {
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
                        cover
                        bio
                        skills
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
                  const update = await this.composeClient.executeQuery<{
                    createProfile: { document: Profile };
                  }>(`
                    mutation {
                      createProfile(input: {
                        content:{
                          greeniaProfileID: "${createGreenia.data.createGreeniaProfile.document.id}"
                        }
                      })
                      {
                        document {
                          id
                          name
                          email
                          avatar
                        }
                      }
                    }
                  `);

                  if (update.errors != null && update.errors.length > 0) {
                    reject(update);
                  } else {
                    resolve(params);
                  }
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

  async getProfile(): Promise<Profile | GreeniaProfile> {
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
                  name
                  email
                  avatar
                  articles(last: 300) {
                    edges {
                      node {
                        id
                        body
                        isDeleted
                        isEncrypted
                        price
                        shortDescription
                        tags
                        thumbnail
                        title
                        encryptedSymmetricKey
                        unifiedAccessControlConditions
                        commentsCount
                        likesCount
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
                articles: _.get(
                  profile.data.viewer.profile,
                  'articles.edges',
                  []
                ).map((i: { node: any }) => i.node)
              };

              switch (this.community) {
                case 'greenia':
                  const greeniaProfile = await this.composeClient.executeQuery<{
                    viewer: { profile: GreeniaProfile };
                  }>(`
                    query {
                      viewer {
                        profile {
                          id
                          bio
                          cover
                          skills
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
                    if (greeniaProfile.data?.viewer?.profile != null) {
                      resolve({
                        ...profileData,
                        ...greeniaProfile.data?.viewer?.profile,
                        educations: _.get(
                          profile.data.viewer.profile,
                          'educations.edges',
                          []
                        ).map((i: { node: any }) => i.node),
                        experiences: _.get(
                          profile.data.viewer.profile,
                          'experiences.edges',
                          []
                        ).map((i: { node: any }) => i.node)
                      });
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

  async getUserProfile(
    id: string
  ): Promise<ProfileTypeBasedOnCommunities<typeof this.community>> {
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
                name
                email
                avatar
                greeniaProfileID
                embodiaProfileID
                avatiaProfileID
                centeriaProfileID
                incarniaProfileID
                weariaProfileID
                chats {
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
                receivedChats {
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
          switch (this.community) {
            case 'greenia':
              if (
                profile.data.node.greeniaProfileID != null &&
                profile.data.node.greeniaProfileID !== ''
              ) {
                const greeniaProfile = await this.composeClient.executeQuery<{
                  node: GreeniaProfile;
                }>(`
                  query {
                    node(id: "${profile.data.node.greeniaProfileID}") {
                      ... on GreeniaProfile {
                        cover
                        bio
                        skills
                        experiences(last:300) {
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
                        educations(last:300) {
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
                  resolve({
                    ...profile.data.node,
                    chats: profile.data.node.chats.edges.map(
                      (chat) => chat.node
                    ),
                    receivedChats: profile.data.node.receivedChats.edges.map(
                      (chat) => chat.node
                    ),
                    ...greeniaProfile.data.node
                  });
                }
              } else {
                reject(profile);
              }
              break;
            default:
              reject('Wrong Community');
          }
        }
      })();
    });
  }

  async createChat(recipient: string): Promise<Chat> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user = await this.getUserProfile(recipient);
          const iHaveCreatedBefore = user.chats.find(
            (x) => x.recipientProfileID === recipient
          );
          const theyHaveCreatedBefore = user.receivedChats.find(
            (x) => x.profileID === recipient
          );

          if (iHaveCreatedBefore != null) {
            resolve(iHaveCreatedBefore);
          } else if (theyHaveCreatedBefore != null) {
            resolve(theyHaveCreatedBefore);
          } else {
            const chat = await this.composeClient.executeQuery<{
              createChat: { document: Chat };
            }>(`
              mutation {
                createChat(input: {
                  content:{
                    profileID: "${user.id}",
                    recipientProfileID: "${recipient}",
                    createdAt: "${dayjs().toISOString()}",
                    isDeleted: false
                  }
                })
                {
                  document {
                    id
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
                    createdAt
                    isDeleted
                  }
                }
              }
            `);

            if (chat.errors != null && chat.errors.length > 0) {
              reject(chat);
            } else {
              resolve(chat.data.createChat.document);
            }
          }
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  async getChat(id: string): Promise<Chat> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const chat = await this.composeClient.executeQuery<{
            node: Chat & { messages: { edges: { node: ChatMessage }[] } };
          }>(`
            query {
              node(id: "${id}") {
                ... on Chat {
                  id
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
                  messagesCount
                  messages {
                    edges {
                      node {
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
                  createdAt
                  isDeleted
                }
              }
            }
          `);

          if (chat.errors != null && chat.errors.length > 0) {
            reject(chat);
          } else {
            resolve({
              ...chat.data.node,
              messages: chat.data.node.messages.edges.map((node) => node.node)
            });
          }
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  async sendMessage(
    content: string,
    chatId: string,
    profileId: string,
    userAddress: string,
    recipientAddress: string
  ): Promise<ChatMessage> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const encryption = await encryptString(
            content,
            chatMessageAccessControlGenerator(userAddress, recipientAddress),
            this.chain,
            this.lit
          );

          if (encryption) {
            const message = await this.composeClient.executeQuery<{
              createChatMessage: { document: ChatMessage };
            }>(`
              mutation {
                createChatMessage(input: {
                  content:{
                    chatID: "${chatId}",
                    profileID: "${profileId}",
                    createdAt: "${dayjs().toISOString()}",
                    body: "${encryption.encryptedContent}",
                    unifiedAccessControlConditions: "${encryption.unifiedAccessControlConditions}",
                    encryptedSymmetricKey: "${encryption.encryptedSymmetricKey}"
                  }
                })
                {
                  document {
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
            reject('Cannot encrypt message')
          }
        } catch (e) {
          reject(e);
        }
      })();
    });
  }
}
