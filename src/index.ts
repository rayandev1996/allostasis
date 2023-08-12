import {
  AllostasisConstructor, AvatiaProfile, CenteriaProfile,
  Chain,
  Communities, EmbodiaProfile,
  GreeniaProfile, IncarniaProfile,
  Profile, WeariaProfile
} from './types/allostasis';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { definition } from './constants/definition';
import { RuntimeCompositeDefinition } from '@composedb/types';
import { Store } from './utils/store';
import { getAuthMethod } from './utils/did-provider';
import { DIDSession } from 'did-session';
import { Web3Provider } from '@ethersproject/providers';
import { ethConnect } from '@lit-protocol/auth-browser';
import _ from 'lodash';

export class Allostasis {
  private community: Communities;
  private nodeURL: string;
  private provider: any;
  private chain: Chain;
  private ceramic: CeramicClient;
  private composeClient: ComposeClient;
  private lit: LitNodeClient;

  constructor(options: AllostasisConstructor) {
    this.nodeURL = options.nodeURL;
    this.community = options.community;

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

  async createOrUpdateProfile<T extends GreeniaProfile | EmbodiaProfile | AvatiaProfile | CenteriaProfile | IncarniaProfile | WeariaProfile>(
    params: T
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const create = await this.composeClient.executeQuery<{
            createProfile: { document: Profile };
          }>(`
            mutation {
              createProfile(input: {
                content: {
                  ${Object.keys(params).filter(x => x === 'name' || x === 'email' || x === 'avatar').map(key => {
                    return `${key}: "${params[key]}"`
                  })}
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
                        ${Object.keys(params).filter(x => x === 'cover' || x === 'bio' || x === 'skills').map(key => {
                          if (key === 'skills') {
                            return `${key}: [${params[key].map(i => `"${i}"`).join(',')}]`
                          } else {
                            return `${key}: "${params[key]}"`
                          }
                        })}
                        profileID: "${create.data.createProfile.document.id}"
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

                if (createGreenia.errors != null && createGreenia.errors.length > 0) {
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
}
