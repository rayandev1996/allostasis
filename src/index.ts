import { UnifiedAccessControlConditions } from '@lit-protocol/types/src/lib/types';
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
  Experience,
  Chat,
  ChatMessage
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
import { blobToBase64, buf2hex, decodeB64, getAuthSig } from './utils/lit';
import { create as createIPFS, IPFSHTTPClient } from 'kubo-rpc-client';
import { ethers } from 'ethers';
import { Client, Session } from '@heroiclabs/nakama-js';
import { v4 as uuidv4 } from 'uuid';

export default class Allostasis<
  TCommunity extends keyof Communities = keyof Communities
> {
  private community: TCommunity;
  public nodeURL: string;
  public provider: any;
  public chain: Chain;
  public ceramic: CeramicClient;
  public composeClient: ComposeClient;
  public lit: LitNodeClient;
  public ipfs: IPFSHTTPClient;
  public ethersProvider: Web3Provider;
  public ethersAddress: string;
  public pvtKey: any;
  public nakamaClient: Client;
  public nakamaSession: Session;

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

    if (options.nakama) {
      this.nakamaClient = new Client(
        options.nakama.key,
        options.nakama.server,
        options.nakama.port,
        options.nakama.useSSL
      );
    }

    this.ceramic = new CeramicClient(options.nodeURL);

    this.composeClient = new ComposeClient({
      ceramic: options.nodeURL,
      definition: definition as RuntimeCompositeDefinition
    });

    this.lit = new LitJsSdk.LitNodeClient({
      alertWhenUnauthorized: false,
      debug: options.debugLit ?? false
    });

    if (options.infura) {
      this.ipfs = createIPFS({
        url: options.infura.url,
        headers: {
          authorization: `Basic ${btoa(
            `${options.infura.projectId}:${options.infura.apiKey}`
          )}`
        }
      });
    }

    this.ethersProvider = new ethers.providers.Web3Provider(this.provider);
  }

  /*
   ** Connect the user
   */

  async connect(): Promise<{ did: any; address: string }> {
    return new Promise(async (resolve, reject) => {
      const store = new Store();
      await this.lit.connect();

      try {
        if (
          this.chain.rpcURLs != null &&
          this.chain.blockExplorerUrls != null &&
          this.chain.currency != null
        ) {
          await this.provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${this.chain.id.toString(16)}`,
                rpcUrls: this.chain.rpcURLs,
                chainName: this.chain.name,
                nativeCurrency: {
                  name: this.chain.currency.name,
                  symbol: this.chain.currency.symbol,
                  decimals: this.chain.currency.decimals
                },
                blockExplorerUrls: this.chain.blockExplorerUrls
              }
            ]
          });
        }

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

              this.ethersAddress = address;

              if (this.nakamaClient) {
                try {
                  this.nakamaSession = await this.nakamaClient.authenticateCustom(
                    session.did?.parent.split(':')[4] ?? uuidv4()
                  );
                } catch (e) {
                  // nakama failed
                }
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
    });
  }

  /*
   ** Disconnect the user
   */

  async disconnect(address?: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
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
    });
  }

  /*
   ** Check the connection status of the user
   */

  async isConnected(): Promise<{ did: any; address: string }> {
    return new Promise(async (resolve, reject) => {
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

            this.ethersAddress = address;

            try {
              if (this.nakamaClient) {
                this.nakamaSession = await this.nakamaClient.authenticateCustom(
                  session.did?.parent.split(':')[4] ?? uuidv4()
                );
              }
            } catch (e) {
              // nakama failed
            }
            
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
                        x === 'socialLinks' ||
                        x === 'nakamaID'
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
                  creator {
                    id
                  }
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
                  nakamaID
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
                  id: create.data.createProfile.document.id
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
                creator {
                  id
                }
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
                creator {
                  id
                }
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
                creator {
                  id
                }
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
                creator {
                  id
                }
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
                  creator {
                    id
                  }
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
                  nakamaID
                  experiences(filters: { where: { isDeleted: { equalTo: false } } }, last: 300) {
                    edges {
                      node {
                        creator {
                          id
                        }
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
                  educations(filters: { where: { isDeleted: { equalTo: false } } }, last: 300) {
                    edges {
                      node {
                        creator {
                          id
                        }
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
                  postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  posts(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        body
                        isDeleted
                        isEncrypted
                        createdAt
                        tag1
                        tag2
                        tag3
                        tag4
                        tag5
                        tag6
                        tag7
                        tag8
                        tag9
                        tag10
                        attachment
                        externalURL
                        encryptedSymmetricKey
                        unifiedAccessControlConditions
                        commentsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        comments(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                          edges {
                            node {
                              creator {
                                id
                              }
                              id
                              content
                              replyingToID
                              createdAt
                              isDeleted
                              profileID
                              profile {
                                creator {
                                  id
                                }
                                id
                                displayName
                                avatar
                              }
                            }
                          }
                        }
                        likesCount(filters: { where: { isDeleted: { equalTo: false } } })
                        profile {
                          creator {
                            id
                          }
                          id
                          avatar
                          displayName
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        }
                      }
                    }
                  }
                  followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                  followers(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        isDeleted
                        profileID
                        profile {
                          creator {
                            id
                          }
                          displayName
                          avatar
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        }
                      }
                    }
                  }
                  followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  followings(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        isDeleted
                        targetProfileID
                        targetProfile {
                          creator {
                            id
                          }
                          displayName
                          avatar
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        }
                      }
                    }
                  }
                  chatsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  chats(last: 1000, filters: { where: { isDeleted: { equalTo: false } } }) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        channelID
                        createdAt
                        id
                        isDeleted
                        messages(last: 1000) {
                          edges {
                            node {
                              creator {
                                id
                              }
                              body
                              createdAt
                              encryptedSymmetricKey
                              id
                              messageType
                              profile {
                                creator {
                                  id
                                }
                                id
                                displayName
                                avatar
                                bio
                                nakamaID
                              }
                              profileID
                              unifiedAccessControlConditions
                            }
                          }
                        }
                        messagesCount
                        profile {
                          creator {
                            id
                          }
                          id
                          displayName
                          avatar
                          bio
                          nakamaID
                        }
                        recipientProfile {
                          creator {
                            id
                          }
                          id
                          displayName
                          avatar
                          bio
                          nakamaID
                        }
                      }
                    }
                  }
                  receivedChatsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  receivedChats(last: 1000, filters: { where: { isDeleted: { equalTo: false } } }) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        channelID
                        createdAt
                        id
                        isDeleted
                        messages(last: 1000) {
                          edges {
                            node {
                              creator {
                                id
                              }
                              body
                              createdAt
                              encryptedSymmetricKey
                              id
                              messageType
                              profile {
                                creator {
                                  id
                                }
                                id
                                displayName
                                avatar
                                bio
                                nakamaID
                              }
                              profileID
                              unifiedAccessControlConditions
                            }
                          }
                        }
                        messagesCount
                        profile {
                          creator {
                            id
                          }
                          id
                          displayName
                          avatar
                          bio
                          nakamaID
                        }
                        recipientProfile {
                          creator {
                            id
                          }
                          id
                          displayName
                          avatar
                          bio
                          nakamaID
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
                followers: _.get(
                  profile.data.viewer.profile,
                  'followers.edges',
                  []
                ).map((i: { node: any }) => i.node),
                followings: _.get(
                  profile.data.viewer.profile,
                  'followings.edges',
                  []
                ).map((i: { node: any }) => i.node),
                chats: _.get(
                  profile.data.viewer.profile,
                  'chats.edges',
                  []
                ).map((i: { node: any }) => {
                  return {
                    ...i.node,
                    messages: _.get(i.node, 'messages.edges', []).map(
                      (j) => j.node
                    )
                  };
                }),
                receivedChats: _.get(
                  profile.data.viewer.profile,
                  'receivedChats.edges',
                  []
                ).map((i: { node: any }) => {
                  return {
                    ...i.node,
                    messages: _.get(i.node, 'messages.edges', []).map(
                      (j) => j.node
                    )
                  };
                }),
                posts: _.get(
                  profile.data.viewer.profile,
                  'posts.edges',
                  []
                ).map((i: { node: any }) => {
                  const {
                    tag1,
                    tag2,
                    tag3,
                    tag4,
                    tag5,
                    tag6,
                    tag7,
                    tag8,
                    tag9,
                    tag10,
                    comments,
                    ...other
                  } = i.node;

                  return {
                    ...other,
                    tags: [
                      tag1,
                      tag2,
                      tag3,
                      tag4,
                      tag5,
                      tag6,
                      tag7,
                      tag8,
                      tag9,
                      tag10
                    ].filter((x) => x != null && x != ''),
                    comments: _.get(comments, 'edges', []).map((j) => j.node)
                  };
                })
              };

              switch (this.community) {
                case 'greenia':
                  resolve({
                    ...profileData,
                    id: profileData.id
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
                creator {
                  id
                }
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
                nakamaID
                experiences(filters: { where: { isDeleted: { equalTo: false } } }, last: 300) {
                  edges {
                    node {
                      creator {
                        id
                      }
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
                educations(filters: { where: { isDeleted: { equalTo: false } } }, last: 300) {
                  edges {
                    node {
                      creator {
                        id
                      }
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
                postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                posts(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                  edges {
                    node {
                      creator {
                        id
                      }
                      id
                      body
                      isDeleted
                      isEncrypted
                      createdAt
                      tag1
                      tag2
                      tag3
                      tag4
                      tag5
                      tag6
                      tag7
                      tag8
                      tag9
                      tag10
                      attachment
                      externalURL
                      encryptedSymmetricKey
                      unifiedAccessControlConditions
                      commentsCount(filters: { where: { isDeleted: { equalTo: false } } })
                      comments(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                        edges {
                          node {
                            creator {
                              id
                            }
                            id
                            content
                            replyingToID
                            createdAt
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
                      likesCount(filters: { where: { isDeleted: { equalTo: false } } })
                      profile {
                        creator {
                          id
                        }
                        id
                        avatar
                        displayName
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                        followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                      }
                    }
                  }
                }
                followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                followers(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                  edges {
                    node {
                      creator {
                        id
                      }
                      id
                      isDeleted
                      profile {
                        creator {
                          id
                        }
                        id
                        displayName
                        avatar
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                        followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                      }
                    }
                  }
                }
                followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                followings(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                  edges {
                    node {
                      creator {
                        id
                      }
                      id
                      isDeleted
                      targetProfile {
                        creator {
                          id
                        }
                        id
                        displayName
                        avatar
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                        followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
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
            educations: _.get(profile.data.node, 'educations.edges', []).map(
              (i: { node: any }) => i.node
            ),
            experiences: _.get(profile.data.node, 'experiences.edges', []).map(
              (i: { node: any }) => i.node
            ),
            followers: _.get(profile.data.node, 'followers.edges', []).map(
              (i: { node: any }) => i.node
            ),
            followings: _.get(profile.data.node, 'followings.edges', []).map(
              (i: { node: any }) => i.node
            ),
            posts: _.get(profile.data.node, 'posts.edges', []).map(
              (i: { node: any }) => {
                const {
                  tag1,
                  tag2,
                  tag3,
                  tag4,
                  tag5,
                  tag6,
                  tag7,
                  tag8,
                  tag9,
                  tag10,
                  comments,
                  ...other
                } = i.node;

                return {
                  ...other,
                  tags: [
                    tag1,
                    tag2,
                    tag3,
                    tag4,
                    tag5,
                    tag6,
                    tag7,
                    tag8,
                    tag9,
                    tag10
                  ].filter((x) => x != null && x != ''),
                  comments: _.get(comments, 'edges', []).map((j) => j.node)
                };
              }
            )
          });
        }
      })();
    });
  }

  /*
   ** Get profiles of users
   */

  async getUserProfiles(params: {
    numberPerPage: number;
    cursor: string;
    search?: { q?: string };
  }): Promise<{ users: Profile[]; cursor: string }> {
    return new Promise((resolve, reject) => {
      (async () => {
        const profiles = await this.composeClient.executeQuery<{
          profileIndex: { edges: { node: Profile; cursor: string }[] };
        }>(`
          query {
            profileIndex(
              ${
                _.get(params, 'search.q', '') != ''
                  ? `filters: { where: { displayName: { equalTo: "${params.search.q}" } } },`
                  : ''
              }
              first: ${params.numberPerPage}, 
              after: "${params.cursor}"
            ) {
              edges {
                node {
                  creator {
                    id
                  }
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
                  nakamaID
                  experiences(filters: { where: { isDeleted: { equalTo: false } } }, last: 300) {
                    edges {
                      node {
                        creator {
                          id
                        }
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
                  educations(filters: { where: { isDeleted: { equalTo: false } } }, last: 300) {
                    edges {
                      node {
                        creator {
                          id
                        }
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
                  postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  posts(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        body
                        isDeleted
                        isEncrypted
                        createdAt
                        tag1
                        tag2
                        tag3
                        tag4
                        tag5
                        tag6
                        tag7
                        tag8
                        tag9
                        tag10
                        attachment
                        externalURL
                        encryptedSymmetricKey
                        unifiedAccessControlConditions
                        commentsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        comments(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                          edges {
                            node {
                              creator {
                                id
                              }
                              id
                              content
                              replyingToID
                              createdAt
                              isDeleted
                              profileID
                              profile {
                                creator {
                                  id
                                }
                                id
                                displayName
                                avatar
                              }
                            }
                          }
                        }
                        likesCount(filters: { where: { isDeleted: { equalTo: false } } })
                        profile {
                          creator {
                            id
                          }
                          id
                          avatar
                          displayName
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        }
                      }
                    }
                  }
                  followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                  followers(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        isDeleted
                        profile {
                          creator {
                            id
                          }
                          id
                          displayName
                          avatar
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        }
                      }
                    }
                  }
                  followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  followings(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        isDeleted
                        targetProfile {
                          creator {
                            id
                          }
                          id
                          displayName
                          avatar
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                          followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
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

        if (profiles.errors != null && profiles.errors.length > 0) {
          reject(profiles);
        } else {
          resolve({
            users: profiles.data.profileIndex.edges.map((x) => ({
              ...x.node,
              educations: _.get(x.node, 'educations.edges', []).map(
                (i: { node: any }) => i.node
              ),
              experiences: _.get(x.node, 'experiences.edges', []).map(
                (i: { node: any }) => i.node
              ),
              followers: _.get(x.node, 'followers.edges', []).map(
                (i: { node: any }) => i.node
              ),
              followings: _.get(x.node, 'followings.edges', []).map(
                (i: { node: any }) => i.node
              ),
              posts: _.get(x.node, 'posts.edges', []).map(
                (i: { node: any }) => {
                  const {
                    tag1,
                    tag2,
                    tag3,
                    tag4,
                    tag5,
                    tag6,
                    tag7,
                    tag8,
                    tag9,
                    tag10,
                    comments,
                    ...other
                  } = i.node;

                  return {
                    ...other,
                    tags: [
                      tag1,
                      tag2,
                      tag3,
                      tag4,
                      tag5,
                      tag6,
                      tag7,
                      tag8,
                      tag9,
                      tag10
                    ].filter((x) => x != null && x != ''),
                    comments: _.get(comments, 'edges', []).map((j) => j.node)
                  };
                }
              )
            })),
            cursor: profiles.data?.profileIndex?.edges.at(-1)?.cursor ?? ''
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
   ** Encrypt a content
   */

  async encryptContent(
    content: string,
    unifiedAccessControlConditions: UnifiedAccessControlConditions
  ): Promise<{
    encryptedString: string;
    encryptedSymmetricKey: string;
    unifiedAccessControlConditions: string;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
          content
        );

        const authSig = await LitJsSdk.checkAndSignAuthMessage({
          chain: this.chain.name
        });

        const encryptedSymmetricKey = await this.lit.saveEncryptionKey({
          unifiedAccessControlConditions,
          symmetricKey,
          authSig,
          chain: this.chain.name
        });

        resolve({
          encryptedString: await blobToBase64(encryptedString),
          encryptedSymmetricKey: buf2hex(encryptedSymmetricKey),
          unifiedAccessControlConditions: btoa(
            JSON.stringify(unifiedAccessControlConditions)
          )
        });
      } catch (e) {
        reject(e);
      }
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
    return new Promise(async (resolve, reject) => {
      try {
        const store = new Store();

        const authSig = await getAuthSig(store);

        const decodedString = decodeB64(content);

        const _access = JSON.parse(atob(unifiedAccessControlConditions));

        const decryptedSymmetricKey = await this.lit.getEncryptionKey({
          unifiedAccessControlConditions: _access,
          toDecrypt: encryptedSymmetricKey,
          chain: this.chain.name,
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
          createPost: {
            document: Post & {
              tag1: string;
              tag2: string;
              tag3: string;
              tag4: string;
              tag5: string;
              tag6: string;
              tag7: string;
              tag8: string;
              tag9: string;
              tag10: string;
            };
          };
        }>(`
          mutation {
            createPost(input: {
              content: {
                body: "${params.body}",
                profileID: "${params.profileID}",
                attachment: "${params.attachment}",
                externalURL: "${params.externalURL}",
                isEncrypted: ${params.isEncrypted},
                ${params.tags.map((x, i) => `tag${i + 1}: "${x}",`)}
                createdAt: "${dayjs().toISOString()}",
                isDeleted: false
              }
            })
            {
              document {
                creator {
                  id
                }
                id
                body
                profileID
                attachment
                externalURL
                isEncrypted
                tag1
                tag2
                tag3
                tag4
                tag5
                tag6
                tag7
                tag8
                tag9
                tag10
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
          const {
            tag1,
            tag2,
            tag3,
            tag4,
            tag5,
            tag6,
            tag7,
            tag8,
            tag9,
            tag10,
            ...other
          } = create.data.createPost.document;
          resolve({
            ...other,
            tags: [
              tag1,
              tag2,
              tag3,
              tag4,
              tag5,
              tag6,
              tag7,
              tag8,
              tag9,
              tag10
            ].filter((x) => x != null && x != '')
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
          updatePost: {
            document: Post & {
              tag1: string;
              tag2: string;
              tag3: string;
              tag4: string;
              tag5: string;
              tag6: string;
              tag7: string;
              tag8: string;
              tag9: string;
              tag10: string;
            };
          };
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
                ${params.tags.map((x, i) => `tag${i + 1}: "${x}",`)}
              }
            })
            {
              document {
                creator {
                  id
                }
                id
                body
                profileID
                attachment
                externalURL
                isEncrypted
                tag1
                tag2
                tag3
                tag4
                tag5
                tag6
                tag7
                tag8
                tag9
                tag10
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
          const {
            tag1,
            tag2,
            tag3,
            tag4,
            tag5,
            tag6,
            tag7,
            tag8,
            tag9,
            tag10,
            ...other
          } = update.data.updatePost.document;

          resolve({
            ...other,
            tags: [
              tag1,
              tag2,
              tag3,
              tag4,
              tag5,
              tag6,
              tag7,
              tag8,
              tag9,
              tag10
            ].filter((x) => x != null && x != '')
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
    search?: {
      q?: string;
      profiles?: string[];
    };
  }): Promise<{ posts: Post[]; cursor: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.composeClient.executeQuery<{
          postIndex: {
            edges: {
              node: Post & {
                tag1: string;
                tag2: string;
                tag3: string;
                tag4: string;
                tag5: string;
                tag6: string;
                tag7: string;
                tag8: string;
                tag9: string;
                tag10: string;
              };
              cursor: string;
            }[];
          };
        }>(`
          query {
            postIndex(
              ${
                _.get(params, 'search.q', '') != ''
                  ? `filters: {
                      or: [
                        { where: { tag1: { equalTo: "${params.search.q}" ${
                      params.search.profiles
                        ? `, profileID: { in: [${params.search.profiles
                            .map((x) => `"${x}"`)
                            .join(',')}] }`
                        : ''
                    } } } },
                        { where: { tag2: { equalTo: "${params.search.q}" ${
                      params.search.profiles
                        ? `, profileID: { in: [${params.search.profiles
                            .map((x) => `"${x}"`)
                            .join(',')}] }`
                        : ''
                    } } } },
                        { where: { tag3: { equalTo: "${params.search.q}" ${
                      params.search.profiles
                        ? `, profileID: { in: [${params.search.profiles
                            .map((x) => `"${x}"`)
                            .join(',')}] }`
                        : ''
                    } } } },
                        { where: { tag4: { equalTo: "${params.search.q}" ${
                      params.search.profiles
                        ? `, profileID: { in: [${params.search.profiles
                            .map((x) => `"${x}"`)
                            .join(',')}] }`
                        : ''
                    } } } },
                        { where: { tag5: { equalTo: "${params.search.q}" ${
                      params.search.profiles
                        ? `, profileID: { in: [${params.search.profiles
                            .map((x) => `"${x}"`)
                            .join(',')}] }`
                        : ''
                    } } } },
                        { where: { tag6: { equalTo: "${params.search.q}" ${
                      params.search.profiles
                        ? `, profileID: { in: [${params.search.profiles
                            .map((x) => `"${x}"`)
                            .join(',')}] }`
                        : ''
                    } } } },
                        { where: { tag7: { equalTo: "${params.search.q}" ${
                      params.search.profiles
                        ? `, profileID: { in: [${params.search.profiles
                            .map((x) => `"${x}"`)
                            .join(',')}] }`
                        : ''
                    } } } },
                        { where: { tag8: { equalTo: "${params.search.q}" ${
                      params.search.profiles
                        ? `, profileID: { in: [${params.search.profiles
                            .map((x) => `"${x}"`)
                            .join(',')}] }`
                        : ''
                    } } } },
                        { where: { tag9: { equalTo: "${params.search.q}" ${
                      params.search.profiles
                        ? `, profileID: { in: [${params.search.profiles
                            .map((x) => `"${x}"`)
                            .join(',')}] }`
                        : ''
                    } } } },
                        { where: { tag10: { equalTo: "${params.search.q}" ${
                      params.search.profiles
                        ? `, profileID: { in: [${params.search.profiles
                            .map((x) => `"${x}"`)
                            .join(',')}] }`
                        : ''
                    } } } }
                      ]
                    },`
                  : ''
              }
              ${
                _.get(params, 'search.profiles', []).length > 0
                  ? `filters: {
                      where: { profileID: { in: [${params.search.profiles
                        .map((x) => `"${x}"`)
                        .join(',')}] } }
                    },`
                  : ''
              }
              sorting: { createdAt: DESC },
              first: ${params.numberPerPage}, 
              after: "${params.cursor}"
            ) {
              edges {
                node {
                  creator {
                    id
                  }
                  id
                  body
                  profileID
                  attachment
                  externalURL
                  isEncrypted
                  tag1
                  tag2
                  tag3
                  tag4
                  tag5
                  tag6
                  tag7
                  tag8
                  tag9
                  tag10
                  createdAt
                  isDeleted
                  unifiedAccessControlConditions
                  encryptedSymmetricKey
                  profile {
                    creator {
                      id
                    }
                    id
                    displayName
                    avatar
                    nakamaID
                    bio
                    postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                    followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                    followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  }
                  commentsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  comments(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        content
                        replyingToID
                        createdAt
                        isDeleted
                        profileID
                        profile {
                          creator {
                            id
                          }
                          id
                          displayName
                          avatar
                          nakamaID
                          bio
                        }
                      }
                    }
                  }
                  likesCount(filters: { where: { isDeleted: { equalTo: false } } })
                  likes(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        isDeleted
                        profileID
                        profile {
                          creator {
                            id
                          }
                          id
                          displayName
                          avatar
                          nakamaID
                          bio
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
            posts: list.data.postIndex.edges.map((x) => {
              const {
                tag1,
                tag2,
                tag3,
                tag4,
                tag5,
                tag6,
                tag7,
                tag8,
                tag9,
                tag10,
                likes,
                comments,
                ...other
              } = x.node;

              return {
                ...other,
                tags: [
                  tag1,
                  tag2,
                  tag3,
                  tag4,
                  tag5,
                  tag6,
                  tag7,
                  tag8,
                  tag9,
                  tag10
                ].filter((x) => x != null && x != ''),
                likes: _.get(likes, 'edges', []).map(
                  (x: { node: PostLike }) => x.node
                ),
                comments: _.get(comments, 'edges', []).map(
                  (x: { node: PostComment }) => x.node
                )
              };
            }),
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
          node: Post & {
            tag1: string;
            tag2: string;
            tag3: string;
            tag4: string;
            tag5: string;
            tag6: string;
            tag7: string;
            tag8: string;
            tag9: string;
            tag10: string;
          };
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
                tag1
                tag2
                tag3
                tag4
                tag5
                tag6
                tag7
                tag8
                tag9
                tag10
                createdAt
                isDeleted
                unifiedAccessControlConditions
                encryptedSymmetricKey
                profile {
                  creator {
                    id
                  }
                  id
                  displayName
                  avatar
                  nakamaID
                  bio
                  postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  followersCount(filters: { where: { isDeleted: { equalTo: false } } })
                  followingsCount(filters: { where: { isDeleted: { equalTo: false } } })
                }
                commentsCount(filters: { where: { isDeleted: { equalTo: false } } })
                comments(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                  edges {
                    node {
                      creator {
                        id
                      }
                      id
                      content
                      replyingToID
                      createdAt
                      isDeleted
                      profileID
                      profile {
                        creator {
                          id
                        }
                        id
                        displayName
                        avatar
                        nakamaID
                        bio
                      }
                    }
                  }
                }
                likesCount(filters: { where: { isDeleted: { equalTo: false } } })
                likes(filters: { where: { isDeleted: { equalTo: false } } }, last: 1000) {
                  edges {
                    node {
                      creator {
                        id
                      }
                      id
                      isDeleted
                      profileID
                      profile {
                        creator {
                          id
                        }
                        id
                        displayName
                        avatar
                        nakamaID
                        bio
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
          const {
            tag1,
            tag2,
            tag3,
            tag4,
            tag5,
            tag6,
            tag7,
            tag8,
            tag9,
            tag10,
            likes,
            comments,
            ...other
          } = post.data.node;

          resolve({
            ...other,
            tags: [
              tag1,
              tag2,
              tag3,
              tag4,
              tag5,
              tag6,
              tag7,
              tag8,
              tag9,
              tag10
            ].filter((x) => x != null && x != ''),
            likes: _.get(likes, 'edges', []).map(
              (x: { node: PostLike }) => x.node
            ),
            comments: _.get(comments, 'edges', []).map(
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
    replyingTo?: string;
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
                ${
                  params.replyingTo
                    ? `replyingToID: "${params.replyingTo}",`
                    : ''
                }
                isDeleted: false
              }
            }) 
            {
              document {
                creator {
                  id
                }
                id
                content
                createdAt
                postID
                profileID
                profile {
                  id
                  displayName
                  avatar
                  nakamaID
                  bio
                }
                isDeleted
                replyingToID
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
          postLikeIndex: { edges: { node: PostLike }[] };
        }>(`
          query {
            postLikeIndex(
              filters: {
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
              },
              last: 1
            ) {
              edges {
                node {
                  creator {
                    id
                  }
                  id
                  postID
                  profileID
                  profile {
                    id
                    displayName
                    avatar
                    nakamaID
                    bio
                  }
                  isDeleted
                }
              }
            }
          }
        `);

        if (liked.errors != null && liked.errors.length > 0) {
          reject(liked);
        } else {
          if (liked.data.postLikeIndex.edges.length > 0) {
            if (liked.data.postLikeIndex.edges[0].node.isDeleted) {
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
                      creator {
                        id
                      }
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
                    id: "${liked.data.postLikeIndex.edges[0].node.id}",
                    content: {
                      isDeleted: true
                    }
                  }) 
                  {
                    document {
                      creator {
                        id
                      }
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
                    creator {
                      id
                    }
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
          followIndex: { edges: { node: Follow }[] };
        }>(`
          query {
            followIndex(
              filters: {
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
          if (followed.data.followIndex.edges.length > 0) {
            if (followed.data.followIndex.edges[0].node.isDeleted) {
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
              `);

              resolve(true);
            } else {
              await this.composeClient.executeQuery<{
                updateFollow: { document: Follow };
              }>(`
                mutation {
                  updateFollow(input: {
                    id: "${followed.data.followIndex.edges[0].node.id}",
                    content: {
                      isDeleted: true
                    }
                  })
                  {
                    document {
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
   ** User follows others or not
   */

  userFollows = async (params: {
    targetProfileID: string;
    profileID: string;
  }): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        const followed = await this.composeClient.executeQuery<{
          followIndex: { edges: { node: Follow }[] };
        }>(`
          query {
            followIndex(
              filters: {
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
          if (followed.data.followIndex.edges.length > 0) {
            if (followed.data.followIndex.edges[0].node.isDeleted) {
              resolve(false);
            } else {
              resolve(true);
            }
          } else {
            resolve(false);
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  /*
   ** Get or create chat
   */

  async getOrCreateChat(params: {
    profileID: string;
    recipientProfileID: string;
    channelID: string;
  }): Promise<Chat> {
    return new Promise(async (resolve, reject) => {
      const chats = await this.composeClient.executeQuery<{
        chatIndex: { edges: { node: Chat }[] };
      }>(`
          query {
            chatIndex(
              filters: { 
                or: [
                  { where: { isDeleted: { equalTo: false }, profileID: { equalTo: "${params.profileID}" }, recipientProfileID: { equalTo: "${params.recipientProfileID}" } } },
                  { where: { isDeleted: { equalTo: false }, recipientProfileID: { equalTo: "${params.profileID}" }, profileID: { equalTo: "${params.recipientProfileID}" } } }
                ]
              },
              first: 1
            ) {
              edges {
                node {
                  creator {
                    id
                  }
                  channelID
                  createdAt
                  id
                  isDeleted
                  messages(last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        body
                        createdAt
                        encryptedSymmetricKey
                        id
                        messageType
                        profile {
                          creator {
                            id
                          }
                          id
                          displayName
                          avatar
                          bio
                          nakamaID
                        }
                        profileID
                        unifiedAccessControlConditions
                      }
                    }
                  }
                  messagesCount
                  profile {
                    creator {
                      id
                    }
                    id
                    displayName
                    avatar
                    bio
                    nakamaID
                  }
                  recipientProfile {
                    creator {
                      id
                    }
                    id
                    displayName
                    avatar
                    bio
                    nakamaID
                  }  
                }
              }
            }
          }
        `);

      if (chats.errors != null && chats.errors.length > 0) {
        reject(chats);
      } else {
        if (chats.data.chatIndex.edges.length > 0) {
          const chat = chats.data.chatIndex.edges[0];

          resolve({
            ...chat.node,
            messages: _.get(chat.node, 'messages.edges', []).map(
              (x: { node: ChatMessage }) => x.node
            )
          });
        } else {
          const create = await this.composeClient.executeQuery<{
            createChat: { document: Chat };
          }>(`
              mutation {
                createChat(input: {
                  content: {
                    profileID: "${params.profileID}",
                    recipientProfileID: "${params.recipientProfileID}",
                    channelID: "${params.channelID}",
                    isDeleted: false,
                    createdAt: "${dayjs().toISOString()}",
                  }
                })
                {
                  document {
                    creator {
                      id
                    }
                    channelID
                    createdAt
                    id
                    isDeleted
                    messages(last: 1000) {
                      edges {
                        node {
                          creator {
                            id
                          }
                          body
                          createdAt
                          encryptedSymmetricKey
                          id
                          messageType
                          profile {
                            creator {
                              id
                            }
                            id
                            displayName
                            avatar
                            bio
                            nakamaID
                          }
                          profileID
                          unifiedAccessControlConditions
                        }
                      }
                    }
                    messagesCount
                    profile {
                      creator {
                        id
                      }
                      id
                      displayName
                      avatar
                      bio
                      nakamaID
                    }
                    recipientProfile {
                      creator {
                        id
                      }
                      id
                      displayName
                      avatar
                      bio
                      nakamaID
                    }
                  }
                }
              }
            `);

          if (create.errors != null && create.errors.length > 0) {
            reject(create);
          } else {
            resolve({
              ...create.data.createChat.document,
              messages: []
            });
          }
        }
      }
    });
  }

  /*
   ** Get chats of user
   */

  async getChats(params: {
    profile: string;
    cursor: string;
  }): Promise<{ chats: Chat[]; cursor: string }> {
    return new Promise((resolve, reject) => {
      (async () => {
        const chats = await this.composeClient.executeQuery<{
          chatIndex: { edges: { node: Chat; cursor: string }[] };
        }>(`
          query {
            chatIndex(
              filters: { 
                or: [
                  { where: { isDeleted: { equalTo: false }, profileID: { equalTo: "${params.profile}" } } },
                  { where: { isDeleted: { equalTo: false }, recipientProfileID: { equalTo: "${params.profile}" } } }
                ]
              },
              first: 1000,
              after: "${params.cursor}"
            ) {
              edges {
                node {
                  creator {
                    id
                  }
                  channelID
                  createdAt
                  id
                  isDeleted
                  messages(last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        body
                        createdAt
                        encryptedSymmetricKey
                        id
                        messageType
                        profile {
                          creator {
                            id
                          }
                          id
                          displayName
                          avatar
                          bio
                          nakamaID
                        }
                        profileID
                        unifiedAccessControlConditions
                      }
                    }
                  }
                  messagesCount
                  profile {
                    creator {
                      id
                    }
                    id
                    displayName
                    avatar
                    bio
                    nakamaID
                  }
                  recipientProfile {
                    creator {
                      id
                    }
                    id
                    displayName
                    avatar
                    bio
                    nakamaID
                  }  
                }
                cursor
              }
            }
          }
        `);

        if (chats.errors != null && chats.errors.length > 0) {
          reject(chats);
        } else {
          if (chats.data.chatIndex.edges.length > 0) {
            resolve({
              chats: chats.data.chatIndex.edges.map((x) => {
                return {
                  ...x.node,
                  messages: _.get(x.node, 'messages.edges', []).map(
                    (x: { node: ChatMessage }) => x.node
                  )
                };
              }),
              cursor: chats.data?.chatIndex?.edges.at(-1)?.cursor ?? ''
            });
          } else {
            resolve(null);
          }
        }
      })();
    });
  }

  /*
   ** Send a message
   */

  async sendMessage(params: {
    content: string;
    chatID: string;
    profileID: string;
    messageType: string;
    unifiedAccessControlConditions?: UnifiedAccessControlConditions;
  }): Promise<ChatMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        let encryption;
        if (params.unifiedAccessControlConditions != null) {
          encryption = await this.encryptContent(
            params.content,
            params.unifiedAccessControlConditions
          );
        }

        const create = await this.composeClient.executeQuery<{
          createChatMessage: { document: ChatMessage };
        }>(`
          mutation {
            createChatMessage(input: {
              content: {
                body: "${encryption ? encryption.encryptedString : params.content}",
                unifiedAccessControlConditions: "${encryption ? encryption.unifiedAccessControlConditions : 'null'}",
                encryptedSymmetricKey: "${encryption ? encryption.encryptedSymmetricKey : 'null'}",
                profileID: "${params.profileID}",
                chatID: "${params.chatID}",
                messageType: "${params.messageType}",
                createdAt: "${dayjs().toISOString()}",
              }
            })
            {
              document {
                creator {
                  id
                }
                body
                createdAt
                encryptedSymmetricKey
                id
                messageType
                profile {
                  creator {
                    id
                  }
                  id
                  displayName
                  avatar
                  bio
                  nakamaID
                }
                profileID
                unifiedAccessControlConditions
              }
            }
          }
        `);

        if (create.errors != null && create.errors.length > 0) {
          reject(create);
        } else {
          resolve(create.data.createChatMessage.document);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
