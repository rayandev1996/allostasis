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
  ChatMessage,
  ENV,
  PROVIDER_TYPE,
  Article,
  ArticleLike,
  ArticleComment,
  SDK_MODEL
} from './types/allostasis';
import { GreeniaProfile } from './types/greenia';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { definition } from './constants/definition';
import { definition as definitionStage } from './constants/definition-stage';
import { definition as startupDefinition } from './constants/startup-definition';
import { definition as startupDefinitionStage } from './constants/startup-definition-stage';
import { definition as platformDefinition } from './constants/platform-definition';
import { definition as platformDefinitionStage } from './constants/platform-definition-stage';
import { RuntimeCompositeDefinition } from '@composedb/types';
import { Store } from './utils/store';
import { Web3Provider } from '@ethersproject/providers';
import _ from 'lodash';
import dayjs from 'dayjs';
import { create as createIPFS, IPFSHTTPClient } from 'kubo-rpc-client';
import { Client, Session } from '@heroiclabs/nakama-js';
import { DID } from 'dids';
import { hash } from '@stablelib/sha256';
import { uint8Array } from './utils/uint8Array';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import KeyResolver from 'key-did-resolver';
import { StartupArticle, StartupArticleComment, StartupArticleLike, StartupPost, StartupPostComment, StartupPostLike, StartupProfile } from './types/startup';
import { PlatformArticle, PlatformArticleComment, PlatformArticleLike, PlatformPost, PlatformPostComment, PlatformPostLike, PlatformProfile } from './types/platform';

export default class Allostasis<
  TCommunity extends keyof Communities = keyof Communities
> {
  public community: TCommunity;
  public providerType: PROVIDER_TYPE;
  public env: ENV;
  public nodeURL: string;
  public provider: any;
  public chain: Chain;
  public ceramic: CeramicClient;
  public composeClient: ComposeClient;
  public ipfs: IPFSHTTPClient;
  public ethersProvider: Web3Provider;
  public ethersAddress: string;
  public pvtKey: any;
  public nakamaClient: Client;
  public nakamaSession: Session;
  public encryptionDid: DID;
  public authenticatedEncryptionDid: string;
  public model: SDK_MODEL;

  constructor(community: TCommunity, options: AllostasisConstructor) {
    this.nodeURL = options.nodeURL;
    this.community = community;

    if (options.env) {
      this.env = options.env;
    } else {
      this.env = 'production';
    }

    if (options.model) {
      this.model = options.model;
    } else {
      this.model = 'user';
    }

    if (options.providerType) {
      this.providerType = options.providerType;
    } else {
      this.providerType = 'metamask';
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
      definition:
        this.model === 'user'
          ? this.env === 'production'
            ? (definition as RuntimeCompositeDefinition)
            : (definitionStage as RuntimeCompositeDefinition)
          : this.model === 'startup'
          ? this.env === 'production'
            ? (startupDefinition as RuntimeCompositeDefinition)
            : (startupDefinitionStage as RuntimeCompositeDefinition)
          : this.env === 'production'
          ? (platformDefinition as RuntimeCompositeDefinition)
          : (platformDefinitionStage as RuntimeCompositeDefinition)
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
  }

  /*
   ** Connect the user
   */

  async connect(address: string): Promise<{
    did: any;
    authenticatedEncryptionDid: string;
  }> {
    return new Promise(async (resolve, reject) => {
      const store = new Store();

      try {
        const entropy = await this.provider.request({
          method: 'personal_sign',
          params: [
            'Give this app permission to read or write your private data on ceramic',
            address
          ]
        });
        const seed = hash(uint8Array(entropy.slice(2)));
        let seed_json = JSON.stringify(seed, (key, value) => {
          if (value instanceof Uint8Array) {
            return Array.from(value);
          }
          return value;
        });
        await store.setItem('ceramic:did_seed', seed_json);
        console.log(seed, 'seed');

        const did = new DID({
          resolver: KeyResolver.getResolver(),
          provider: new Ed25519Provider(seed)
        });
        const didStr = await did.authenticate();
        console.log(did, 'did');

        // set ceramic & composeDB DID
        this.ceramic.did = did;
        this.composeClient.setDID(did);

        // set encryption DID
        this.encryptionDid = did;
        this.authenticatedEncryptionDid = didStr;

        // authenticate nakama
        if (this.nakamaClient) {
          try {
            this.nakamaSession = await this.nakamaClient.authenticateCustom(
              address
            );
          } catch (e) {
            // nakama failed
          }
        }

        resolve({
          did: didStr,
          authenticatedEncryptionDid: this.authenticatedEncryptionDid
        });
      } catch (e) {
        store.removeItem('ceramic:did_seed');
        reject(e);
      }
    });
  }

  /*
   ** Disconnect the user
   */

  async disconnect(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const store = new Store();

      try {
        await store.removeItem('ceramic:did_seed');

        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Check the connection status of the user
   */

  async isConnected(address: string): Promise<{
    did: any;
    authenticatedEncryptionDid: string;
  }> {
    return new Promise(async (resolve, reject) => {
      await this.ceramic;
      const store = new Store();

      const seed_json_value = await store.getItem('ceramic:did_seed');

      if (seed_json_value) {
        let seed = new Uint8Array(JSON.parse(seed_json_value));
        console.log(seed, 'seed');

        try {
          const did = new DID({
            resolver: KeyResolver.getResolver(),
            provider: new Ed25519Provider(seed)
          });
          const didStr = await did.authenticate();

          // connect ceramic
          this.ceramic.did = did;
          this.composeClient.setDID(did);

          // set encryption DID
          this.encryptionDid = did;
          this.authenticatedEncryptionDid = didStr;

          // connect to Nakama
          try {
            if (this.nakamaClient) {
              this.nakamaSession = await this.nakamaClient.authenticateCustom(
                address
              );
            }
          } catch (e) {
            // nakama failed
          }

          resolve({
            did: didStr,
            authenticatedEncryptionDid: this.authenticatedEncryptionDid
          });
        } catch (e) {
          reject(e);
        }
      } else {
        reject('seed not found');
      }
    });
  }

  /*
   ** Create or update profile for signed used
   */

  async createOrUpdateProfile(
    params: Omit<
      ProfileTypeBasedOnCommunities<TCommunity>,
      'publicEncryptionDID'
    > & { publicEncryptionDID?: string }
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
                        x === 'socialLinks' ||
                        x === 'publicEncryptionDID' ||
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
                  publicEncryptionDID {
                    id
                  }
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
                  publicEncryptionDID {
                    id
                  }
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
                  articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                  articles(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        abstract
                        visualAbstract
                        body
                        price
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
                                publicEncryptionDID {
                                  id
                                }
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
                          publicEncryptionDID {
                            id
                          }
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
                          publicEncryptionDID {
                            id
                          }
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
                                publicEncryptionDID {
                                  id
                                }
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
                          publicEncryptionDID {
                            id
                          }
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
                          publicEncryptionDID {
                            id
                          }
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
                }),
                articles: _.get(
                  profile.data.viewer.profile,
                  'articles.edges',
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
                publicEncryptionDID {
                  id
                }
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
                articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                articles(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                  edges {
                    node {
                      creator {
                        id
                      }
                      id
                      abstract
                      visualAbstract
                      body
                      price
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
            ),
            articles: _.get(profile.data.node, 'articles.edges', []).map(
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
                  publicEncryptionDID {
                    id
                  }
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
                  articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                  articles(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        abstract
                        visualAbstract
                        body
                        price
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
              ),
              articles: _.get(x.node, 'articles.edges', []).map(
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
   ** Create an article
   */

  async createArticle(params: {
    abstract: string;
    visualAbstract: string;
    price: number;
    body: string;
    tags?: string[];
    attachment?: string;
    externalURL?: string;
    isEncrypted?: boolean;
    profileID: string;
  }): Promise<Article> {
    return new Promise(async (resolve, reject) => {
      try {
        const create = await this.composeClient.executeQuery<{
          createArticle: {
            document: Article & {
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
            createArticle(input: {
              content: {
                abstract: "${params.abstract}",
                visualAbstract: "${params.visualAbstract}",
                body: "${params.body}",
                profileID: "${params.profileID}",
                attachment: "${params.attachment}",
                price: ${params.price},
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
                abstract
                visualAbstract
                body
                price
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
          } = create.data.createArticle.document;
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
          } as Article);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Update an article
   */

  async updateArticle(params: {
    id: string;
    abstract: string;
    visualAbstract: string;
    price: string;
    body: string;
    tags?: string[];
    attachment?: string;
    externalURL?: string;
    isEncrypted?: boolean;
    unifiedAccessControlConditions?: string;
    encryptedSymmetricKey?: string;
    profileID: string;
  }): Promise<Article> {
    return new Promise(async (resolve, reject) => {
      try {
        const update = await this.composeClient.executeQuery<{
          updateArticle: {
            document: Article & {
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
            updateArticle(input: {
              id: "${params.id}",
              content: {
                abstract: "${params.abstract}",
                visualAbstract: "${params.visualAbstract}",
                body: "${params.body}",
                price: ${params.price},
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
                abstract
                visualAbstract
                body
                price
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
          } = update.data.updateArticle.document;

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
          } as Article);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Get the list of articles
   */

  async getArticles(params: {
    numberPerPage: number;
    cursor: string;
    search?: {
      q?: string;
      profiles?: string[];
    };
  }): Promise<{ articles: Article[]; cursor: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.composeClient.executeQuery<{
          articleIndex: {
            edges: {
              node: Article & {
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
            articleIndex(
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
                  abstract
                  visualAbstract
                  body
                  price
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
                    publicEncryptionDID {
                      id
                    }
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
                          publicEncryptionDID {
                            id
                          }
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
                          publicEncryptionDID {
                            id
                          }
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
            articles: list.data.articleIndex.edges.map((x) => {
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
                  (x: { node: ArticleLike }) => x.node
                ),
                comments: _.get(comments, 'edges', []).map(
                  (x: { node: ArticleComment }) => x.node
                )
              };
            }),
            cursor: list.data?.articleIndex?.edges.at(-1)?.cursor ?? ''
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Get an article by ID
   */

  async getArticle(params: { id: string }): Promise<Article | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const article = await this.composeClient.executeQuery<{
          node: Article & {
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
              ... on Article {
                creator {
                  id
                }
                id
                abstract
                visualAbstract
                body
                price
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
                  publicEncryptionDID {
                    id
                  }
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
                        publicEncryptionDID {
                          id
                        }
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
                        publicEncryptionDID {
                          id
                        }
                        bio
                      }
                    }
                  }
                }
              }
            }
          }
        `);

        if (article.errors != null && article.errors.length > 0) {
          reject(article);
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
          } = article.data.node;

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
              (x: { node: ArticleLike }) => x.node
            ),
            comments: _.get(comments, 'edges', []).map(
              (x: { node: ArticleComment }) => x.node
            )
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Create an article comment
   */

  createArticleComment = async (params: {
    content: string;
    articleID: string;
    profileID: string;
    replyingTo?: string;
  }): Promise<ArticleComment | undefined> => {
    return new Promise(async (resolve, reject) => {
      try {
        const create = await this.composeClient.executeQuery<{
          createArticleComment: { document: ArticleComment };
        }>(`
          mutation {
            createArticleComment(input: {
              content: {
                content: "${params.content}",
                articleID: "${params.articleID}",
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
                articleID
                profileID
                profile {
                  id
                  displayName
                  avatar
                  nakamaID
                  publicEncryptionDID {
                    id
                  }
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
          resolve(create.data?.createArticleComment?.document);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  /*
   ** Like or unlike an article
   */

  likeArticle = async (params: {
    articleID: string;
    profileID: string;
  }): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        const liked = await this.composeClient.executeQuery<{
          articleLikeIndex: { edges: { node: ArticleLike }[] };
        }>(`
          query {
            articleLikeIndex(
              filters: {
                and: [
                  {
                    where: {
                      articleID: {
                        equalTo: "${params.articleID}"
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
                  articleID
                  profileID
                  profile {
                    id
                    displayName
                    avatar
                    nakamaID
                    publicEncryptionDID {
                      id
                    }
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
          if (liked.data.articleLikeIndex.edges.length > 0) {
            if (liked.data.articleLikeIndex.edges[0].node.isDeleted) {
              await this.composeClient.executeQuery<{
                createArticleLike: { document: ArticleLike };
              }>(`
                mutation {
                  createArticleLike(input: {
                    content: {
                      articleID: "${params.articleID}",
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
                      articleID
                      profileID
                      isDeleted
                    }
                  }
                }
              `);

              resolve(true);
            } else {
              await this.composeClient.executeQuery<{
                updateArticleLike: { document: ArticleLike };
              }>(`
                mutation {
                  updateArticleLike(input: {
                    id: "${liked.data.articleLikeIndex.edges[0].node.id}",
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
                      articleID
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
              createArticleLike: { document: ArticleLike };
            }>(`
              mutation {
                createArticleLike(input: {
                  content: {
                    articleID: "${params.articleID}",
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
                    articleID
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
                    publicEncryptionDID {
                      id
                    }
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
                          publicEncryptionDID {
                            id
                          }
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
                          publicEncryptionDID {
                            id
                          }
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
                  publicEncryptionDID {
                    id
                  }
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
                        publicEncryptionDID {
                          id
                        }
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
                        publicEncryptionDID {
                          id
                        }
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
                  publicEncryptionDID {
                    id
                  }
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
                    publicEncryptionDID {
                      id
                    }
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
                          publicEncryptionDID {
                            id
                          }
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
                    publicEncryptionDID {
                      id
                    }
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
                    publicEncryptionDID {
                      id
                    }
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
                            publicEncryptionDID {
                              id
                            }
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
                      publicEncryptionDID {
                        id
                      }
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
                      publicEncryptionDID {
                        id
                      }
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
                          publicEncryptionDID {
                            id
                          }
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
                    publicEncryptionDID {
                      id
                    }
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
                    publicEncryptionDID {
                      id
                    }
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
    encryptionDid?: string[];
    publicEncryptionDIDs?: string[];
  }): Promise<ChatMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        let body = params.content;

        if (
          params.publicEncryptionDIDs != null &&
          params.publicEncryptionDIDs.length > 0
        ) {
          if (this.encryptionDid) {
            const jwe = await this.encryptionDid.createDagJWE(
              { body },
              params.publicEncryptionDIDs
            );
            body = JSON.stringify(jwe).replace(/"/g, '`');
          } else {
            reject('Encryption DID is not set');
          }
        }

        const create = await this.composeClient.executeQuery<{
          createChatMessage: { document: ChatMessage };
        }>(`
          mutation {
            createChatMessage(input: {
              content: {
                body: "${body}",
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
                  publicEncryptionDID {
                    id
                  }
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

  /* =======================================================
  /* ==================== Startups =========================
  /* =======================================================

  /*
   ** Create or update startup profile for signed used
   */

   async createOrUpdateStartupProfile(
    params: Omit<StartupProfile, 'publicEncryptionDID'> & {
      publicEncryptionDID?: string;
    }
  ): Promise<StartupProfile> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const create = await this.composeClient.executeQuery<{
            createProfile: { document: StartupProfile };
          }>(`
            mutation {
              createProfile(input: {
                content: {
                  ${Object.keys(params)
                    .map((key) => {
                      if (key === 'socialLinks') {
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
                  name
                  slogan
                  cover
                  logo
                  projectHistory
                  projectCompellingVideo
                  projectVision
                  projectMission
                  requestedFund
                  fundingStartDate
                  email
                  phoneNumber
                  address
                  socialLinks
                  platformID
                  nakamaID
                  publicEncryptionDID {
                    id
                  }
                }
              }
            }
          `);

          if (create.errors != null && create.errors.length > 0) {
            reject(create);
          } else {
            resolve({
              ...create.data.createProfile.document,
            } as StartupProfile);
          }
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  /*
   ** Get startup profile of signed account
   */

  async getStartupProfile(): Promise<StartupProfile> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const profile = await this.composeClient.executeQuery<{
            viewer: { profile: StartupProfile };
          }>(`
            query {
              viewer {
                profile {
                  creator {
                    id
                  }
                  id
                  name
                  slogan
                  cover
                  logo
                  projectHistory
                  projectCompellingVideo
                  projectVision
                  projectMission
                  requestedFund
                  fundingStartDate
                  email
                  phoneNumber
                  address
                  platformID
                  socialLinks
                  nakamaID
                  publicEncryptionDID {
                    id
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
                                name
                                slogan
                                logo
                                postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                                articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                        }
                      }
                    }
                  }
                  articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                  articles(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        abstract
                        visualAbstract
                        body
                        price
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
                                name
                                slogan
                                logo
                                postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                                articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                }),
                articles: _.get(
                  profile.data.viewer.profile,
                  'articles.edges',
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

              resolve({
                ...profileData
              } as StartupProfile);
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
   ** Get profile of a startup
   */

   async getStartupProfileByID(id: string): Promise<StartupProfile> {
    return new Promise((resolve, reject) => {
      (async () => {
        const profile = await this.composeClient.executeQuery<{
          node: StartupProfile;
        }>(`
          query {
            node(id: "${id}") {
              ... on Profile {
                creator {
                  id
                }
                id
                name
                slogan
                cover
                logo
                projectHistory
                projectCompellingVideo
                projectVision
                projectMission
                requestedFund
                fundingStartDate
                email
                phoneNumber
                address
                platformID
                socialLinks
                nakamaID
                publicEncryptionDID {
                  id
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
                              name
                              slogan
                              logo
                              postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                              articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                      }
                    }
                  }
                }
                articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                articles(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                  edges {
                    node {
                      creator {
                        id
                      }
                      id
                      abstract
                      visualAbstract
                      body
                      price
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
                              name
                              slogan
                              logo
                              postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                              articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
            ),
            articles: _.get(profile.data.node, 'articles.edges', []).map(
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
   ** Get profiles of startups
   */

  async getStartupProfiles(params: {
    numberPerPage: number;
    cursor: string;
    search?: { q?: string };
  }): Promise<{ users: PlatformProfile[]; cursor: string }> {
    return new Promise((resolve, reject) => {
      (async () => {
        const profiles = await this.composeClient.executeQuery<{
          profileIndex: { edges: { node: PlatformProfile; cursor: string }[] };
        }>(`
          query {
            profileIndex(
              ${
                _.get(params, 'search.q', '') != ''
                  ? `filters: { where: { name: { equalTo: "${params.search.q}" } } },`
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
                  name
                  slogan
                  cover
                  logo
                  projectHistory
                  projectCompellingVideo
                  projectVision
                  projectMission
                  requestedFund
                  fundingStartDate
                  email
                  phoneNumber
                  address
                  socialLinks
                  nakamaID
                  platformID
                  publicEncryptionDID {
                    id
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
                                name
                                slogan
                                logo
                                postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                                articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                        }
                      }
                    }
                  }
                  articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                  articles(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        abstract
                        visualAbstract
                        body
                        price
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
                                name
                                slogan
                                logo
                                postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                                articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
              ),
              articles: _.get(x.node, 'articles.edges', []).map(
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
   ** Create an article for startup
   */

   async createStartupArticle(params: {
    abstract: string;
    visualAbstract: string;
    price: number;
    body: string;
    tags?: string[];
    attachment?: string;
    externalURL?: string;
    isEncrypted?: boolean;
    profileID: string;
  }): Promise<StartupArticle> {
    return new Promise(async (resolve, reject) => {
      try {
        const create = await this.composeClient.executeQuery<{
          createArticle: {
            document: StartupArticle & {
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
            createArticle(input: {
              content: {
                abstract: "${params.abstract}",
                visualAbstract: "${params.visualAbstract}",
                body: "${params.body}",
                profileID: "${params.profileID}",
                attachment: "${params.attachment}",
                price: ${params.price},
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
                abstract
                visualAbstract
                body
                price
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
          } = create.data.createArticle.document;
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
          } as StartupArticle);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Update an article for startup
   */

  async updateStartupArticle(params: {
    id: string;
    abstract: string;
    visualAbstract: string;
    price: string;
    body: string;
    tags?: string[];
    attachment?: string;
    externalURL?: string;
    isEncrypted?: boolean;
    unifiedAccessControlConditions?: string;
    encryptedSymmetricKey?: string;
    profileID: string;
  }): Promise<StartupArticle> {
    return new Promise(async (resolve, reject) => {
      try {
        const update = await this.composeClient.executeQuery<{
          updateArticle: {
            document: StartupArticle & {
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
            updateArticle(input: {
              id: "${params.id}",
              content: {
                abstract: "${params.abstract}",
                visualAbstract: "${params.visualAbstract}",
                body: "${params.body}",
                price: ${params.price},
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
                abstract
                visualAbstract
                body
                price
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
          } = update.data.updateArticle.document;

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
          } as StartupArticle);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Get the list of articles of startups
   */

  async getStartupArticles(params: {
    numberPerPage: number;
    cursor: string;
    search?: {
      q?: string;
      profiles?: string[];
    };
  }): Promise<{ articles: StartupArticle[]; cursor: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.composeClient.executeQuery<{
          articleIndex: {
            edges: {
              node: StartupArticle & {
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
            articleIndex(
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
                  abstract
                  visualAbstract
                  body
                  price
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
                    name
                    slogan
                    logo
                    nakamaID
                    publicEncryptionDID {
                      id
                    }
                    postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                    articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          nakamaID
                          publicEncryptionDID {
                            id
                          }
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          nakamaID
                          publicEncryptionDID {
                            id
                          }
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
            articles: list.data.articleIndex.edges.map((x) => {
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
                  (x: { node: PlatformArticleLike }) => x.node
                ),
                comments: _.get(comments, 'edges', []).map(
                  (x: { node: PlatformArticleComment }) => x.node
                )
              };
            }),
            cursor: list.data?.articleIndex?.edges.at(-1)?.cursor ?? ''
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Get a startup article by ID
   */

  async getStartupArticle(params: { id: string }): Promise<StartupArticle | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const article = await this.composeClient.executeQuery<{
          node: StartupArticle & {
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
              ... on Article {
                creator {
                  id
                }
                id
                abstract
                visualAbstract
                body
                price
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
                  name
                  slogan
                  logo
                  nakamaID
                  publicEncryptionDID {
                    id
                  }
                  postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        nakamaID
                        publicEncryptionDID {
                          id
                        }
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        nakamaID
                        publicEncryptionDID {
                          id
                        }
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                      }
                    }
                  }
                }
              }
            }
          }
        `);

        if (article.errors != null && article.errors.length > 0) {
          reject(article);
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
          } = article.data.node;

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
              (x: { node: StartupArticleLike }) => x.node
            ),
            comments: _.get(comments, 'edges', []).map(
              (x: { node: StartupArticleComment }) => x.node
            )
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Create a post for startup
   */

   async createStartupPost(params: {
    body: string;
    tags?: string[];
    attachment?: string;
    profileID: string;
  }): Promise<StartupPost> {
    return new Promise(async (resolve, reject) => {
      try {
        const create = await this.composeClient.executeQuery<{
          createPost: {
            document: StartupPost & {
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
          } as StartupPost);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Update a post for startup
   */

  async updateStartupPost(params: {
    id: string;
    body: string;
    tags?: string[];
    attachment?: string;
    profileID: string;
  }): Promise<StartupPost> {
    return new Promise(async (resolve, reject) => {
      try {
        const update = await this.composeClient.executeQuery<{
          updatePost: {
            document: StartupPost & {
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
          } as StartupPost);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Get the list of startup posts
   */

  async getStartupPosts(params: {
    numberPerPage: number;
    cursor: string;
    search?: {
      q?: string;
      profiles?: string[];
    };
  }): Promise<{ posts: StartupPost[]; cursor: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.composeClient.executeQuery<{
          postIndex: {
            edges: {
              node: StartupPost & {
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
                  profile {
                    creator {
                      id
                    }
                    id
                    name
                    slogan
                    logo
                    nakamaID
                    publicEncryptionDID {
                      id
                    }
                    postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                    articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          nakamaID
                          publicEncryptionDID {
                            id
                          }
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          nakamaID
                          publicEncryptionDID {
                            id
                          }
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                  (x: { node: StartupPostLike }) => x.node
                ),
                comments: _.get(comments, 'edges', []).map(
                  (x: { node: StartupPostComment }) => x.node
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
   ** Get a startup post by ID
   */

  async getStartupPost(params: { id: string }): Promise<StartupPost | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const post = await this.composeClient.executeQuery<{
          node: StartupPost & {
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
                profile {
                  creator {
                    id
                  }
                  id
                  name
                  slogan
                  logo
                  nakamaID
                  publicEncryptionDID {
                    id
                  }
                  postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        nakamaID
                        publicEncryptionDID {
                          id
                        }
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        nakamaID
                        publicEncryptionDID {
                          id
                        }
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
              (x: { node: StartupPostLike }) => x.node
            ),
            comments: _.get(comments, 'edges', []).map(
              (x: { node: StartupPostComment }) => x.node
            )
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /* =======================================================
  /* ==================== Platforms ========================
  /* =======================================================

  /*
   ** Create or update platform profile for signed used
   */

  async createOrUpdatePlatformProfile(
    params: Omit<PlatformProfile, 'publicEncryptionDID'> & {
      publicEncryptionDID?: string;
    }
  ): Promise<PlatformProfile> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const create = await this.composeClient.executeQuery<{
            createProfile: { document: PlatformProfile };
          }>(`
            mutation {
              createProfile(input: {
                content: {
                  ${Object.keys(params)
                    .map((key) => {
                      if (key === 'socialLinks') {
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
                  name
                  slogan
                  cover
                  logo
                  projectHistory
                  projectCompellingVideo
                  projectVision
                  projectMission
                  requestedFund
                  fundingStartDate
                  email
                  phoneNumber
                  address
                  socialLinks
                  nakamaID
                  publicEncryptionDID {
                    id
                  }
                }
              }
            }
          `);

          if (create.errors != null && create.errors.length > 0) {
            reject(create);
          } else {
            resolve({
              ...create.data.createProfile.document,
            } as PlatformProfile);
          }
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  /*
   ** Get platform profile of signed account
   */

  async getPlatformProfile(): Promise<PlatformProfile> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const profile = await this.composeClient.executeQuery<{
            viewer: { profile: PlatformProfile };
          }>(`
            query {
              viewer {
                profile {
                  creator {
                    id
                  }
                  id
                  name
                  slogan
                  cover
                  logo
                  projectHistory
                  projectCompellingVideo
                  projectVision
                  projectMission
                  requestedFund
                  fundingStartDate
                  email
                  phoneNumber
                  address
                  socialLinks
                  nakamaID
                  publicEncryptionDID {
                    id
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
                                name
                                slogan
                                logo
                                postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                                articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                        }
                      }
                    }
                  }
                  articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                  articles(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        abstract
                        visualAbstract
                        body
                        price
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
                                name
                                slogan
                                logo
                                postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                                articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                }),
                articles: _.get(
                  profile.data.viewer.profile,
                  'articles.edges',
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

              resolve({
                ...profileData
              } as PlatformProfile);
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
   ** Get profile of a platform
   */

   async getPlatformProfileByID(id: string): Promise<PlatformProfile> {
    return new Promise((resolve, reject) => {
      (async () => {
        const profile = await this.composeClient.executeQuery<{
          node: PlatformProfile;
        }>(`
          query {
            node(id: "${id}") {
              ... on Profile {
                creator {
                  id
                }
                id
                name
                slogan
                cover
                logo
                projectHistory
                projectCompellingVideo
                projectVision
                projectMission
                requestedFund
                fundingStartDate
                email
                phoneNumber
                address
                socialLinks
                nakamaID
                publicEncryptionDID {
                  id
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
                              name
                              slogan
                              logo
                              postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                              articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                      }
                    }
                  }
                }
                articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                articles(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                  edges {
                    node {
                      creator {
                        id
                      }
                      id
                      abstract
                      visualAbstract
                      body
                      price
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
                              name
                              slogan
                              logo
                              postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                              articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
            ),
            articles: _.get(profile.data.node, 'articles.edges', []).map(
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
   ** Get profiles of platforms
   */

  async getPlatformProfiles(params: {
    numberPerPage: number;
    cursor: string;
    search?: { q?: string };
  }): Promise<{ users: PlatformProfile[]; cursor: string }> {
    return new Promise((resolve, reject) => {
      (async () => {
        const profiles = await this.composeClient.executeQuery<{
          profileIndex: { edges: { node: PlatformProfile; cursor: string }[] };
        }>(`
          query {
            profileIndex(
              ${
                _.get(params, 'search.q', '') != ''
                  ? `filters: { where: { name: { equalTo: "${params.search.q}" } } },`
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
                  name
                  slogan
                  cover
                  logo
                  projectHistory
                  projectCompellingVideo
                  projectVision
                  projectMission
                  requestedFund
                  fundingStartDate
                  email
                  phoneNumber
                  address
                  socialLinks
                  nakamaID
                  publicEncryptionDID {
                    id
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
                                name
                                slogan
                                logo
                                postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                                articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                        }
                      }
                    }
                  }
                  articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                  articles(filters: { where: { isDeleted: { equalTo: false } } }, sorting: { createdAt: DESC }, last: 1000) {
                    edges {
                      node {
                        creator {
                          id
                        }
                        id
                        abstract
                        visualAbstract
                        body
                        price
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
                                name
                                slogan
                                logo
                                postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                                articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
              ),
              articles: _.get(x.node, 'articles.edges', []).map(
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
   ** Create an article for platform
   */

   async createPlatformArticle(params: {
    abstract: string;
    visualAbstract: string;
    price: number;
    body: string;
    tags?: string[];
    attachment?: string;
    externalURL?: string;
    isEncrypted?: boolean;
    profileID: string;
  }): Promise<PlatformArticle> {
    return new Promise(async (resolve, reject) => {
      try {
        const create = await this.composeClient.executeQuery<{
          createArticle: {
            document: PlatformArticle & {
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
            createArticle(input: {
              content: {
                abstract: "${params.abstract}",
                visualAbstract: "${params.visualAbstract}",
                body: "${params.body}",
                profileID: "${params.profileID}",
                attachment: "${params.attachment}",
                price: ${params.price},
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
                abstract
                visualAbstract
                body
                price
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
          } = create.data.createArticle.document;
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
          } as PlatformArticle);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Update an article for platform
   */

  async updatePlatformArticle(params: {
    id: string;
    abstract: string;
    visualAbstract: string;
    price: string;
    body: string;
    tags?: string[];
    attachment?: string;
    externalURL?: string;
    isEncrypted?: boolean;
    unifiedAccessControlConditions?: string;
    encryptedSymmetricKey?: string;
    profileID: string;
  }): Promise<PlatformArticle> {
    return new Promise(async (resolve, reject) => {
      try {
        const update = await this.composeClient.executeQuery<{
          updateArticle: {
            document: PlatformArticle & {
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
            updateArticle(input: {
              id: "${params.id}",
              content: {
                abstract: "${params.abstract}",
                visualAbstract: "${params.visualAbstract}",
                body: "${params.body}",
                price: ${params.price},
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
                abstract
                visualAbstract
                body
                price
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
          } = update.data.updateArticle.document;

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
          } as PlatformArticle);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Get the list of articles platforms
   */

  async getPlatformArticles(params: {
    numberPerPage: number;
    cursor: string;
    search?: {
      q?: string;
      profiles?: string[];
    };
  }): Promise<{ articles: PlatformArticle[]; cursor: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.composeClient.executeQuery<{
          articleIndex: {
            edges: {
              node: PlatformArticle & {
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
            articleIndex(
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
                  abstract
                  visualAbstract
                  body
                  price
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
                    name
                    slogan
                    logo
                    nakamaID
                    publicEncryptionDID {
                      id
                    }
                    postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                    articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          nakamaID
                          publicEncryptionDID {
                            id
                          }
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          nakamaID
                          publicEncryptionDID {
                            id
                          }
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
            articles: list.data.articleIndex.edges.map((x) => {
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
                  (x: { node: PlatformArticleLike }) => x.node
                ),
                comments: _.get(comments, 'edges', []).map(
                  (x: { node: PlatformArticleComment }) => x.node
                )
              };
            }),
            cursor: list.data?.articleIndex?.edges.at(-1)?.cursor ?? ''
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Get a platform article by ID
   */

  async getPlatformArticle(params: { id: string }): Promise<PlatformArticle | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const article = await this.composeClient.executeQuery<{
          node: PlatformArticle & {
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
              ... on Article {
                creator {
                  id
                }
                id
                abstract
                visualAbstract
                body
                price
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
                  name
                  slogan
                  logo
                  nakamaID
                  publicEncryptionDID {
                    id
                  }
                  postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        nakamaID
                        publicEncryptionDID {
                          id
                        }
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        nakamaID
                        publicEncryptionDID {
                          id
                        }
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
                      }
                    }
                  }
                }
              }
            }
          }
        `);

        if (article.errors != null && article.errors.length > 0) {
          reject(article);
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
          } = article.data.node;

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
              (x: { node: PlatformArticleLike }) => x.node
            ),
            comments: _.get(comments, 'edges', []).map(
              (x: { node: PlatformArticleComment }) => x.node
            )
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Create a post for platform
   */

   async createPlatformPost(params: {
    body: string;
    tags?: string[];
    attachment?: string;
    profileID: string;
  }): Promise<PlatformPost> {
    return new Promise(async (resolve, reject) => {
      try {
        const create = await this.composeClient.executeQuery<{
          createPost: {
            document: PlatformPost & {
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
          } as PlatformPost);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Update a post for platform
   */

  async updatePlatformPost(params: {
    id: string;
    body: string;
    tags?: string[];
    attachment?: string;
    profileID: string;
  }): Promise<PlatformPost> {
    return new Promise(async (resolve, reject) => {
      try {
        const update = await this.composeClient.executeQuery<{
          updatePost: {
            document: PlatformPost & {
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
          } as PlatformPost);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
   ** Get the list of platform posts
   */

  async getPlatformPosts(params: {
    numberPerPage: number;
    cursor: string;
    search?: {
      q?: string;
      profiles?: string[];
    };
  }): Promise<{ posts: PlatformPost[]; cursor: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.composeClient.executeQuery<{
          postIndex: {
            edges: {
              node: PlatformPost & {
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
                  profile {
                    creator {
                      id
                    }
                    id
                    name
                    slogan
                    logo
                    nakamaID
                    publicEncryptionDID {
                      id
                    }
                    postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                    articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          nakamaID
                          publicEncryptionDID {
                            id
                          }
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                          name
                          slogan
                          logo
                          nakamaID
                          publicEncryptionDID {
                            id
                          }
                          postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                          articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                  (x: { node: PlatformPostLike }) => x.node
                ),
                comments: _.get(comments, 'edges', []).map(
                  (x: { node: PlatformPostComment }) => x.node
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
   ** Get a platform post by ID
   */

  async getPlatformPost(params: { id: string }): Promise<PlatformPost | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const post = await this.composeClient.executeQuery<{
          node: PlatformPost & {
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
                profile {
                  creator {
                    id
                  }
                  id
                  name
                  slogan
                  logo
                  nakamaID
                  publicEncryptionDID {
                    id
                  }
                  postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                  articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        nakamaID
                        publicEncryptionDID {
                          id
                        }
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
                        name
                        slogan
                        logo
                        nakamaID
                        publicEncryptionDID {
                          id
                        }
                        postsCount(filters: { where: { isDeleted: { equalTo: false } } })
                        articlesCount(filters: { where: { isDeleted: { equalTo: false } } })
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
              (x: { node: PlatformPostLike }) => x.node
            ),
            comments: _.get(comments, 'edges', []).map(
              (x: { node: PlatformPostComment }) => x.node
            )
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
