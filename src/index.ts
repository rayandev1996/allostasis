import {
  AllostasisConstructor,
  Chain,
  Communities,
  Profile,
  ProfileTypeBasedOnCommunities,
  Post,
  PostLike,
  PostComment,
  Follow,
  Education,
  Experience
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
import { decodeB64, getAuthSig } from './utils/lit';
import { create as createIPFS, IPFSHTTPClient } from 'kubo-rpc-client';
import { ethers } from 'ethers';
import * as PushAPI from '@pushprotocol/restapi';
import { IUser, SignerType } from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';

export default class Allostasis<
  TCommunity extends keyof Communities = keyof Communities
> {
  private community: TCommunity;
  private nodeURL: string;
  private connectPush: boolean;
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
    this.connectPush = options.connectPush ?? true;

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

  /*
   ** Connect the user
   */

  async connect(): Promise<{ did: any; address: string }> {
    return new Promise((resolve, reject) => {
      (async () => {
        const store = new Store();
        await this.lit.connect();

        try {
          await this.provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${this.chain.id.toString(16)}`,
                rpcUrls: [
                  'https://rpc-mumbai.maticvigil.com/v1/96bf5fa6e03d272fbd09de48d03927b95633726c'
                ],
                chainName: 'Mumbai',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                blockExplorerUrls: ['https://mumbai.polygonscan.com/']
              }
            ]
          });

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

                if (this.connectPush) {
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
                }
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

  /*
   ** Disconnect the user
   */

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

  /*
   ** Check the connection status of the user
   */

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

  /*
   ** Create or update profile for signed used
   */

  async createOrUpdateProfile(
    params: ProfileTypeBasedOnCommunities<TCommunity>
  ): Promise<ProfileTypeBasedOnCommunities<TCommunity>> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          console.log(Object.keys(params));
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
                resolve({
                  ...create.data.createProfile.document,
                  id: create.data.createProfile.document.id,
                } as GreeniaProfile);
                // const createGreenia = await this.composeClient.executeQuery<{
                //   createGreeniaProfile: { document: GreeniaProfile };
                // }>(`
                //   mutation {
                //     createGreeniaProfile(input: {
                //       content: {
                //         profileID: "${create.data.createProfile.document.id}",
                //         ${Object.keys(params)
                //           .filter((x) => x === 'greeniaRelatedProperty')
                //           .map((key) => {
                //             return `${key}: "${params[key]}"`;
                //           })
                //           .join(',')}
                //       }
                //     })
                //     {
                //       document {
                //         id
                //       }
                //     }
                //   }
                // `);

                // if (
                //   createGreenia.errors != null &&
                //   createGreenia.errors.length > 0
                // ) {
                //   reject(createGreenia);
                // } else {
                //   resolve({
                //     ...create.data.createProfile.document,
                //     ...createGreenia.data.createGreeniaProfile.document,
                //     id: create.data.createProfile.document.id,
                //     greeniaProfileId:
                //       createGreenia.data.createGreeniaProfile.document.id
                //   } as GreeniaProfile);
                // }
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

  /*
   ** Create education for user
   */

  createEducation = async (params: {
    title: string;
    school: string;
    city: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    profileID: string;
  }): Promise<Education> => {
    return new Promise(async (resolve, reject) => {
      try {
        const education = await this.composeClient.executeQuery<{
          createEducation: { document: Education };
        }>(`
          mutation {
            createEducation(input: {
              content: {
                profileID: "${params.profileID}",
                title: "${params.title}",
                school: "${params.school}",
                city: "${params.city}",
                description: "${params.description}",
                startDate: "${params.startDate}",
                endDate: "${params.endDate}",
                isDeleted: false
              }
            })
            {
              document {
                id
                profileID
                title
                school
                city
                description
                startDate
                endDate
                isDeleted
              }
            }
          }
        `);

        if (education.errors != null && education.errors.length > 0) {
          reject(education);
        } else {
          resolve(education.data.createEducation.document);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  /*
   ** Update education of a user
   */

  updateEducation = async (params: {
    id: string;
    title: string;
    school: string;
    city: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    profileID: string;
    isDeleted?: boolean;
  }): Promise<Education> => {
    return new Promise(async (resolve, reject) => {
      try {
        const education = await this.composeClient.executeQuery<{
          updateEducation: { document: Education };
        }>(`
          mutation {
            updateEducation(input: {
              id: "${params.id}",
              content: {
                profileID: "${params.profileID}",
                title: "${params.title}",
                school: "${params.school}",
                city: "${params.city}",
                description: "${params.description}",
                startDate: "${params.startDate}",
                endDate: "${params.endDate}",
                isDeleted: ${params.isDeleted}
              }
            })
            {
              document {
                id
                profileID
                title
                school
                city
                description
                startDate
                endDate
                isDeleted
              }
            }
          }
        `);

        if (education.errors != null && education.errors.length > 0) {
          reject(education);
        } else {
          resolve(education.data.updateEducation.document);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  /*
   ** Create experience for user
   */

  createExperience = async (params: {
    title: string;
    company: string;
    city: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    profileID: string;
  }): Promise<Experience> => {
    return new Promise(async (resolve, reject) => {
      try {
        const experience = await this.composeClient.executeQuery<{
          createExperience: { document: Experience };
        }>(`
          mutation {
            createExperience(input: {
              content: {
                profileID: "${params.profileID}",
                title: "${params.title}",
                company: "${params.company}",
                city: "${params.city}",
                description: "${params.description}",
                startDate: "${params.startDate}",
                endDate: "${params.endDate}",
                isDeleted: false
              }
            })
            {
              document {
                id
                profileID
                title
                company
                city
                description
                startDate
                endDate
                isDeleted
              }
            }
          }
        `);

        if (experience.errors != null && experience.errors.length > 0) {
          reject(experience);
        } else {
          resolve(experience.data.createExperience.document);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  /*
   ** Update experience of a user
   */

  updateExperience = async (params: {
    id: string;
    title: string;
    company: string;
    city: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    profileID: string;
    isDeleted?: boolean;
  }): Promise<Education> => {
    return new Promise(async (resolve, reject) => {
      try {
        const experience = await this.composeClient.executeQuery<{
          updateExperience: { document: Education };
        }>(`
          mutation {
            updateExperience(input: {
              id: "${params.id}",
              content: {
                profileID: "${params.profileID}",
                title: "${params.title}",
                company: "${params.company}",
                city: "${params.city}",
                description: "${params.description}",
                startDate: "${params.startDate}",
                endDate: "${params.endDate}",
                isDeleted: ${params.isDeleted}
              }
            })
            {
              document {
                id
                profileID
                title
                company
                city
                description
                startDate
                endDate
                isDeleted
              }
            }
          }
        `);

        if (experience.errors != null && experience.errors.length > 0) {
          reject(experience);
        } else {
          resolve(experience.data.updateExperience.document);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  /*
   ** Get profile of signed account
   */

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
                posts: _.get(
                  profile.data.viewer.profile,
                  'posts.edges',
                  []
                ).map((i: { node: any }) => i.node)
              };

              switch (this.community) {
                case 'greenia':
                  resolve({
                    ...profileData,
                    id: profileData.id,
                  } as GreeniaProfile);
                  // const greeniaProfile = await this.composeClient.executeQuery<{
                  //   viewer: { greeniaProfile: GreeniaProfile };
                  // }>(`
                  //   query {
                  //     viewer {
                  //       greeniaProfile {
                  //         id
                  //       }
                  //     }
                  //   }
                  // `);

                  // if (
                  //   greeniaProfile.errors != null &&
                  //   greeniaProfile.errors.length > 0
                  // ) {
                  //   reject(greeniaProfile);
                  // } else {
                  //   if (greeniaProfile.data?.viewer?.greeniaProfile != null) {
                  //     resolve({
                  //       ...profileData,
                  //       ...greeniaProfile.data?.viewer?.greeniaProfile,
                  //       id: profileData.id,
                  //       greeniaProfileId:
                  //         greeniaProfile.data?.viewer?.greeniaProfile.id
                  //     } as GreeniaProfile);
                  //   } else {
                  //     reject(greeniaProfile);
                  //   }
                  // }
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

  /*
   ** Get profile of a user
   */

  async getUserProfile(id: string): Promise<Profile> {
    return new Promise((resolve, reject) => {
      (async () => {
        const profile = await this.composeClient.executeQuery<{
          node: Profile;
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
              }
            }
          }
        `);

        if (profile.errors != null && profile.errors.length > 0) {
          reject(profile);
        } else {
          resolve({
            ...profile.data.node
          });
        }
      })();
    });
  }

  /*
   ** Get profile of a user in community
   */

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

  /*
   ** Decrypt an encrypted content
   */

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

  /*
   ** Create a post
   */

  async createPost(params: {
    body: string;
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

  /*
   ** Update a post
   */

  async updatePost(params: {
    id: string;
    body: string;
    tags?: string[];
    attachment?: string;
    externalURL?: string;
    isEncrypted?: boolean;
    unifiedAccessControlConditions?: string;
    encryptedSymmetricKey?: string;
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

  /*
   ** Get the list of posts
   */

  async getPosts(params: {
    numberPerPage: number;
    cursor: string;
  }): Promise<{ posts: Post[]; cursor: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.composeClient.executeQuery<{
          postIndex: { edges: { node: Post; cursor: string }[] };
        }>(`
          query {
            postIndex(first: ${params.numberPerPage}, after: "${params.cursor}") {
              edges {
                node {
                  id
                  body
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

  /*
   ** Get a post by ID
   */

  async getPost(params: { id: string }): Promise<Post | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const post = await this.composeClient.executeQuery<{
          node: Post;
        }>(`
          query {
            node(id: "${params.id}") {
              ... on Post {
                creator {
                  id
                }
                id
                body
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
            }
          }
        `);

        if (post.errors != null && post.errors.length > 0) {
          reject(post);
        } else {
          resolve({
            ...post.data.node,
            likes: _.get(post.data.node, 'likes.edges', []).map(
              (x: { node: PostLike }) => x.node
            ),
            comments: _.get(post.data.node, 'comments.edges', []).map(
              (x: { node: PostComment }) => x.node
            )
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Create a post comment
   */

  createPostComment = async (params: {
    content: string;
    postID: string;
    profileID: string;
  }): Promise<PostComment | undefined> => {
    return new Promise(async (resolve, reject) => {
      try {
        const create = await this.composeClient.executeQuery<{
          createPostComment: { document: PostComment };
        }>(`
          mutation {
            createPostComment(input: {
              content: {
                content: "${params.content}",
                postID: "${params.postID}",
                profileID: "${params.profileID}",
                createdAt: "${dayjs().toISOString()}",
                isDeleted: false
              }
            }) 
            {
              document {
                id
                content
                createdAt
                postID
                profileID
                isDeleted
              }
            }
          }
        `);

        if (create.errors != null && create.errors.length > 0) {
          reject(create);
        } else {
          resolve(create.data?.createPostComment?.document);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  /*
   ** Like or unlike a post
   */

  likePost = async (params: {
    postID: string;
    profileID: string;
  }): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        const liked = await this.composeClient.executeQuery<{
          postLikesIndex: { edges: { node: PostLike }[] };
        }>(`
          query {
            postLikesIndex(
              filters: {
                input: {
                  and: [
                    {
                      where: {
                        postID: {
                          equalTo: "${params.postID}"
                        }
                      }
                    },
                    {
                      where: {
                        profileID: {
                          equalTo: "${params.profileID}"
                        }
                      }
                    }
                  ]
                }
              },
              last: 1
            ) {
              edges {
                node {
                  id
                  postID
                  profileID
                  isDeleted
                }
              }
            }
          }
        `);

        if (liked.errors != null && liked.errors.length > 0) {
          reject(liked);
        } else {
          if (liked.data.postLikesIndex.edges.length > 0) {
            if (liked.data.postLikesIndex.edges[0].node.isDeleted) {
              await this.composeClient.executeQuery<{
                createPostLike: { document: PostLike };
              }>(`
                mutation {
                  createPostLike(input: {
                    content: {
                      postID: "${params.postID}",
                      profileID: "${params.profileID}",
                      isDeleted: false
                    }
                  }) 
                  {
                    document {
                      id
                      postID
                      profileID
                      isDeleted
                    }
                  }
                }
              `);

              resolve(true);
            } else {
              await this.composeClient.executeQuery<{
                updatePostLike: { document: PostLike };
              }>(`
                mutation {
                  updatePostLike(input: {
                    id: "${liked.data.postLikesIndex.edges[0].node.id}",
                    content: {
                      isDeleted: true
                    }
                  }) 
                  {
                    document {
                      id
                      postID
                      profileID
                      isDeleted
                    }
                  }
                }
              `);

              resolve(false);
            }
          } else {
            await this.composeClient.executeQuery<{
              createPostLike: { document: PostLike };
            }>(`
              mutation {
                createPostLike(input: {
                  content: {
                    postID: "${params.postID}",
                    profileID: "${params.profileID}",
                    isDeleted: false
                  }
                }) 
                {
                  document {
                    id
                    postID
                    profileID
                    isDeleted
                  }
                }
              }
            `);

            resolve(true);
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  /*
   ** Follow or unfollow a user
   */

  follow = async (params: {
    targetProfileID: string;
    profileID: string;
  }): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        const followed = await this.composeClient.executeQuery<{
          followsIndex: { edges: { node: Follow }[] };
        }>(`
          query {
            followsIndex(
              filters: {
                input: {
                  and: [
                    {
                      where: {
                        profileID: {
                          equalTo: "${params.profileID}"
                        }
                      }
                    },
                    {
                      where: {
                        targetProfileID: {
                          equalTo: "${params.targetProfileID}"
                        }
                      }
                    }
                  ]
                }
              },
              last: 1
            ) {
              edges {
                node {
                  creator {
                    id
                  }
                  id
                  targetProfileID
                  profileID
                  isDeleted
                }
              }
            }
          }
        `);

        if (followed.errors != null && followed.errors.length > 0) {
          reject(followed);
        } else {
          if (followed.data.followsIndex.edges.length > 0) {
            if (followed.data.followsIndex.edges[0].node.isDeleted) {
              await this.composeClient.executeQuery<{
                createFollow: { document: Follow };
              }>(`
                mutation {
                  createFollow(input: {
                    content: {
                      profileID: "${params.profileID}",
                      targetProfileID: "${params.targetProfileID}",
                      isDeleted: false
                    }
                  })
                  {
                    document {
                      id
                      targetProfileID
                      profileID
                      isDeleted
                    }
                  }
                }
              `);

              resolve(true);
            } else {
              await this.composeClient.executeQuery<{
                updateFollow: { document: Follow };
              }>(`
                mutation {
                  updateFollow(input: {
                    id: "${followed.data.followsIndex.edges[0].node.id}",
                    content: {
                      isDeleted: true
                    }
                  })
                  {
                    document {
                      id
                      targetProfileID
                      profileID
                      isDeleted
                    }
                  }
                }
              `);

              resolve(false);
            }
          } else {
            await this.composeClient.executeQuery<{
              createFollow: { document: Follow };
            }>(`
              mutation {
                createFollow(input: {
                  content: {
                    profileID: "${params.profileID}",
                    targetProfileID: "${params.targetProfileID}",
                    isDeleted: false
                  }
                })
                {
                  document {
                    id
                    targetProfileID
                    profileID
                    isDeleted
                  }
                }
              }
            `);

            resolve(true);
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  };
}
