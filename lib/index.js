"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_client_1 = require("@ceramicnetwork/http-client");
const client_1 = require("@composedb/client");
const definition_1 = require("./constants/definition");
const definition_stage_1 = require("./constants/definition-stage");
const store_1 = require("./utils/store");
const did_provider_1 = require("./utils/did-provider");
const did_session_1 = require("did-session");
const lodash_1 = __importDefault(require("lodash"));
const dayjs_1 = __importDefault(require("dayjs"));
const kubo_rpc_client_1 = require("kubo-rpc-client");
const ethers_1 = require("ethers");
const nakama_js_1 = require("@heroiclabs/nakama-js");
const uuid_1 = require("uuid");
const sha256_1 = require("@stablelib/sha256");
const dids_1 = require("dids");
const key_did_provider_ed25519_1 = require("key-did-provider-ed25519");
const key_did_resolver_1 = __importDefault(require("key-did-resolver"));
const uint8Array_1 = require("./utils/uint8Array");
class Allostasis {
    constructor(community, options) {
        /*
         ** Create education for user
         */
        this.createEducation = (params) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const education = yield this.composeClient.executeQuery(`
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
                    }
                    else {
                        resolve(education.data.createEducation.document);
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
        /*
         ** Update education of a user
         */
        this.updateEducation = (params) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const education = yield this.composeClient.executeQuery(`
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
                    }
                    else {
                        resolve(education.data.updateEducation.document);
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
        /*
         ** Create experience for user
         */
        this.createExperience = (params) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const experience = yield this.composeClient.executeQuery(`
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
                    }
                    else {
                        resolve(experience.data.createExperience.document);
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
        /*
         ** Update experience of a user
         */
        this.updateExperience = (params) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const experience = yield this.composeClient.executeQuery(`
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
                    }
                    else {
                        resolve(experience.data.updateExperience.document);
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
        /*
         ** Create a post comment
         */
        this.createPostComment = (params) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    const create = yield this.composeClient.executeQuery(`
          mutation {
            createPostComment(input: {
              content: {
                content: "${params.content}",
                postID: "${params.postID}",
                profileID: "${params.profileID}",
                createdAt: "${(0, dayjs_1.default)().toISOString()}",
                ${params.replyingTo
                        ? `replyingToID: "${params.replyingTo}",`
                        : ''}
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
                    }
                    else {
                        resolve((_b = (_a = create.data) === null || _a === void 0 ? void 0 : _a.createPostComment) === null || _b === void 0 ? void 0 : _b.document);
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
        /*
         ** Like or unlike a post
         */
        this.likePost = (params) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const liked = yield this.composeClient.executeQuery(`
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
                    }
                    else {
                        if (liked.data.postLikeIndex.edges.length > 0) {
                            if (liked.data.postLikeIndex.edges[0].node.isDeleted) {
                                yield this.composeClient.executeQuery(`
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
                            else {
                                yield this.composeClient.executeQuery(`
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
                        }
                        else {
                            yield this.composeClient.executeQuery(`
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
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
        /*
         ** Follow or unfollow a user
         */
        this.follow = (params) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const followed = yield this.composeClient.executeQuery(`
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
                    }
                    else {
                        if (followed.data.followIndex.edges.length > 0) {
                            if (followed.data.followIndex.edges[0].node.isDeleted) {
                                yield this.composeClient.executeQuery(`
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
                            else {
                                yield this.composeClient.executeQuery(`
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
                        }
                        else {
                            yield this.composeClient.executeQuery(`
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
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
        /*
         ** User follows others or not
         */
        this.userFollows = (params) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const followed = yield this.composeClient.executeQuery(`
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
                    }
                    else {
                        if (followed.data.followIndex.edges.length > 0) {
                            if (followed.data.followIndex.edges[0].node.isDeleted) {
                                resolve(false);
                            }
                            else {
                                resolve(true);
                            }
                        }
                        else {
                            resolve(false);
                        }
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
        this.nodeURL = options.nodeURL;
        this.community = community;
        if (options.chain) {
            this.chain = options.chain;
        }
        else {
            this.chain = { name: 'mumbai', id: 80001 };
        }
        if (options.env) {
            this.env = options.env;
        }
        else {
            this.env = 'production';
        }
        if (options.providerType) {
            this.providerType = options.providerType;
        }
        else {
            this.providerType = 'metamask';
        }
        if (!options.provider) {
            if (window.ethereum) {
                this.provider = window.ethereum;
            }
            else {
                console.log('Allostasis', 'An ethereum provider is required to proceed with the connection to Ceramic.');
            }
        }
        else {
            this.provider = options.provider;
        }
        if (options.nakama) {
            this.nakamaClient = new nakama_js_1.Client(options.nakama.key, options.nakama.server, options.nakama.port, options.nakama.useSSL);
        }
        this.ceramic = new http_client_1.CeramicClient(options.nodeURL);
        this.composeClient = new client_1.ComposeClient({
            ceramic: options.nodeURL,
            definition: this.env === 'production'
                ? definition_1.definition
                : definition_stage_1.definition
        });
        if (options.infura) {
            this.ipfs = (0, kubo_rpc_client_1.create)({
                url: options.infura.url,
                headers: {
                    authorization: `Basic ${btoa(`${options.infura.projectId}:${options.infura.apiKey}`)}`
                }
            });
        }
        this.ethersProvider = new ethers_1.ethers.providers.Web3Provider(this.provider);
    }
    /*
     ** Connect the user
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const store = new store_1.Store();
                try {
                    if (this.providerType === 'metamask' &&
                        this.chain.rpcURLs != null &&
                        this.chain.blockExplorerUrls != null &&
                        this.chain.currency != null) {
                        yield this.provider.request({
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
                    if (this.providerType === 'metamask') {
                        yield this.provider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: `0x${this.chain.id.toString(16)}` }]
                        });
                    }
                    const { authMethod, address } = yield (0, did_provider_1.getAuthMethod)(this.provider, this.chain);
                    if (authMethod != null) {
                        const session = yield did_session_1.DIDSession.authorize(authMethod, {
                            resources: this.composeClient.resources
                        });
                        const sessionString = session.serialize();
                        yield store.setItem('ceramic-session', sessionString);
                        this.ethersProvider
                            .send('eth_requestAccounts', [])
                            .then((accounts) => __awaiter(this, void 0, void 0, function* () {
                            var _a, _b;
                            yield this.ceramic.setDID(session.did);
                            this.composeClient.setDID(session.did);
                            this.ethersAddress = address;
                            // authenticate nakama
                            if (this.nakamaClient) {
                                try {
                                    this.nakamaSession =
                                        yield this.nakamaClient.authenticateCustom((_b = (_a = session.did) === null || _a === void 0 ? void 0 : _a.parent.split(':')[4]) !== null && _b !== void 0 ? _b : (0, uuid_1.v4)());
                                }
                                catch (e) {
                                    // nakama failed
                                }
                            }
                            // get encryption DID
                            const entropy = yield this.provider.request({
                                method: 'personal_sign',
                                params: [
                                    'Give this app permission to read or write your private data',
                                    accounts[0]
                                ]
                            });
                            const seed = (0, sha256_1.hash)((0, uint8Array_1.uint8Array)(entropy.slice(2)));
                            this.encryptionDid = new dids_1.DID({
                                resolver: key_did_resolver_1.default.getResolver(),
                                provider: new key_did_provider_ed25519_1.Ed25519Provider(seed)
                            });
                            this.authenticatedEncryptionDid =
                                yield this.encryptionDid.authenticate();
                            // return the response
                            resolve({
                                did: session.did.id,
                                address: address !== null && address !== void 0 ? address : '',
                                authenticatedEncryptionDid: this.authenticatedEncryptionDid
                            });
                        }))
                            .catch((e) => {
                            store.removeItem('ceramic-session');
                            store.removeItem('lit-auth-signature-' + address);
                            store.removeItem('lit-auth-signature');
                            reject(e);
                        });
                    }
                    else {
                        reject('Getting auth method failed');
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    /*
     ** Connect the user using manual DID
     */
    connectManual(session) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const store = new store_1.Store();
                try {
                    const sessionString = session.serialize();
                    yield store.setItem('ceramic-session', sessionString);
                    yield this.ceramic.setDID(session.did);
                    this.composeClient.setDID(session.did);
                    // authenticate nakama
                    if (this.nakamaClient) {
                        try {
                            this.nakamaSession = yield this.nakamaClient.authenticateCustom((_b = (_a = session.did) === null || _a === void 0 ? void 0 : _a.parent.split(':')[4]) !== null && _b !== void 0 ? _b : (0, uuid_1.v4)());
                        }
                        catch (e) {
                            // nakama failed
                        }
                    }
                    // return the response
                    resolve({
                        did: session.did.id
                    });
                }
                catch (e) {
                    store.removeItem('ceramic-session');
                    reject(e);
                }
            }));
        });
    }
    /*
     ** Disconnect the user
     */
    disconnect(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const store = new store_1.Store();
                try {
                    yield store.removeItem('ceramic-session');
                    yield store.removeItem('ceramic:auth_type');
                    yield store.removeItem('lit-web3-provider');
                    yield store.removeItem('lit-comms-keypair');
                    yield store.removeItem('lit-auth-signature');
                    yield store.removeItem(`lit-auth-signature-${address !== null && address !== void 0 ? address : ''}`);
                    resolve(true);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    /*
     ** Check the connection status of the user
     */
    isConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield this.ceramic;
                const store = new store_1.Store();
                const sessionString = yield store.getItem('ceramic-session');
                /** Connect to Ceramic using the session previously stored */
                try {
                    const session = yield did_session_1.DIDSession.fromSession(sessionString !== null && sessionString !== void 0 ? sessionString : '');
                    const { address } = (0, did_provider_1.getAddressFromDid)(session.id);
                    this.ethersProvider
                        .send('eth_requestAccounts', [])
                        .then((accounts) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b;
                        yield this.ceramic.setDID(session.did);
                        this.composeClient.setDID(session.did);
                        this.ethersAddress = address;
                        try {
                            if (this.nakamaClient) {
                                this.nakamaSession = yield this.nakamaClient.authenticateCustom((_b = (_a = session.did) === null || _a === void 0 ? void 0 : _a.parent.split(':')[4]) !== null && _b !== void 0 ? _b : (0, uuid_1.v4)());
                            }
                        }
                        catch (e) {
                            // nakama failed
                        }
                        // get encryption DID
                        const entropy = yield this.provider.request({
                            method: 'personal_sign',
                            params: [
                                'Give this app permission to read or write your private data',
                                accounts[0]
                            ]
                        });
                        const seed = (0, sha256_1.hash)((0, uint8Array_1.uint8Array)(entropy.slice(2)));
                        this.encryptionDid = new dids_1.DID({
                            resolver: key_did_resolver_1.default.getResolver(),
                            provider: new key_did_provider_ed25519_1.Ed25519Provider(seed)
                        });
                        this.authenticatedEncryptionDid =
                            yield this.encryptionDid.authenticate();
                        resolve({
                            did: session.did.id,
                            address: address !== null && address !== void 0 ? address : '',
                            authenticatedEncryptionDid: this.authenticatedEncryptionDid
                        });
                    }))
                        .catch((e) => {
                        store.removeItem('ceramic-session');
                        store.removeItem('lit-auth-signature-' + address);
                        store.removeItem('lit-auth-signature');
                        reject(e);
                    });
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    /*
     ** Create or update profile for signed used
     */
    createOrUpdateProfile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const create = yield this.composeClient.executeQuery(`
            mutation {
              createProfile(input: {
                content: {
                  ${Object.keys(params)
                            .filter((x) => x === 'displayName' ||
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
                            x === 'nakamaID')
                            .map((key) => {
                            if (key === 'skills') {
                                return `${key}: [${params[key]
                                    .map((i) => `"${i}"`)
                                    .join(',')}]`;
                            }
                            else if (key === 'socialLinks') {
                                return `${key}: [${params[key]
                                    .map((i) => `"${i}"`)
                                    .join(',')}]`;
                            }
                            else {
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
                        }
                        else {
                            switch (this.community) {
                                case 'greenia':
                                    resolve(Object.assign(Object.assign({}, create.data.createProfile.document), { id: create.data.createProfile.document.id }));
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
                    }
                    catch (e) {
                        reject(e);
                    }
                }))();
            });
        });
    }
    /*
     ** Get profile of signed account
     */
    getProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    try {
                        const profile = yield this.composeClient.executeQuery(`
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
                        }
                        else {
                            if (((_b = (_a = profile.data) === null || _a === void 0 ? void 0 : _a.viewer) === null || _b === void 0 ? void 0 : _b.profile) != null) {
                                const profileData = Object.assign(Object.assign({}, (_d = (_c = profile.data) === null || _c === void 0 ? void 0 : _c.viewer) === null || _d === void 0 ? void 0 : _d.profile), { educations: lodash_1.default.get(profile.data.viewer.profile, 'educations.edges', []).map((i) => i.node), experiences: lodash_1.default.get(profile.data.viewer.profile, 'experiences.edges', []).map((i) => i.node), followers: lodash_1.default.get(profile.data.viewer.profile, 'followers.edges', []).map((i) => i.node), followings: lodash_1.default.get(profile.data.viewer.profile, 'followings.edges', []).map((i) => i.node), chats: lodash_1.default.get(profile.data.viewer.profile, 'chats.edges', []).map((i) => {
                                        return Object.assign(Object.assign({}, i.node), { messages: lodash_1.default.get(i.node, 'messages.edges', []).map((j) => j.node) });
                                    }), receivedChats: lodash_1.default.get(profile.data.viewer.profile, 'receivedChats.edges', []).map((i) => {
                                        return Object.assign(Object.assign({}, i.node), { messages: lodash_1.default.get(i.node, 'messages.edges', []).map((j) => j.node) });
                                    }), posts: lodash_1.default.get(profile.data.viewer.profile, 'posts.edges', []).map((i) => {
                                        const _a = i.node, { tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10, comments } = _a, other = __rest(_a, ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "comments"]);
                                        return Object.assign(Object.assign({}, other), { tags: [
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
                                            ].filter((x) => x != null && x != ''), comments: lodash_1.default.get(comments, 'edges', []).map((j) => j.node) });
                                    }) });
                                switch (this.community) {
                                    case 'greenia':
                                        resolve(Object.assign(Object.assign({}, profileData), { id: profileData.id }));
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
                            }
                            else {
                                reject(profile);
                            }
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                }))();
            });
        });
    }
    /*
     ** Get profile of a user
     */
    getUserProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    const profile = yield this.composeClient.executeQuery(`
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
                    }
                    else {
                        resolve(Object.assign(Object.assign({}, profile.data.node), { educations: lodash_1.default.get(profile.data.node, 'educations.edges', []).map((i) => i.node), experiences: lodash_1.default.get(profile.data.node, 'experiences.edges', []).map((i) => i.node), followers: lodash_1.default.get(profile.data.node, 'followers.edges', []).map((i) => i.node), followings: lodash_1.default.get(profile.data.node, 'followings.edges', []).map((i) => i.node), posts: lodash_1.default.get(profile.data.node, 'posts.edges', []).map((i) => {
                                const _a = i.node, { tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10, comments } = _a, other = __rest(_a, ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "comments"]);
                                return Object.assign(Object.assign({}, other), { tags: [
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
                                    ].filter((x) => x != null && x != ''), comments: lodash_1.default.get(comments, 'edges', []).map((j) => j.node) });
                            }) }));
                    }
                }))();
            });
        });
    }
    /*
     ** Get profiles of users
     */
    getUserProfiles(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    const profiles = yield this.composeClient.executeQuery(`
          query {
            profileIndex(
              ${lodash_1.default.get(params, 'search.q', '') != ''
                        ? `filters: { where: { displayName: { equalTo: "${params.search.q}" } } },`
                        : ''}
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
                    }
                    else {
                        resolve({
                            users: profiles.data.profileIndex.edges.map((x) => (Object.assign(Object.assign({}, x.node), { educations: lodash_1.default.get(x.node, 'educations.edges', []).map((i) => i.node), experiences: lodash_1.default.get(x.node, 'experiences.edges', []).map((i) => i.node), followers: lodash_1.default.get(x.node, 'followers.edges', []).map((i) => i.node), followings: lodash_1.default.get(x.node, 'followings.edges', []).map((i) => i.node), posts: lodash_1.default.get(x.node, 'posts.edges', []).map((i) => {
                                    const _a = i.node, { tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10, comments } = _a, other = __rest(_a, ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "comments"]);
                                    return Object.assign(Object.assign({}, other), { tags: [
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
                                        ].filter((x) => x != null && x != ''), comments: lodash_1.default.get(comments, 'edges', []).map((j) => j.node) });
                                }) }))),
                            cursor: (_d = (_c = (_b = (_a = profiles.data) === null || _a === void 0 ? void 0 : _a.profileIndex) === null || _b === void 0 ? void 0 : _b.edges.at(-1)) === null || _c === void 0 ? void 0 : _c.cursor) !== null && _d !== void 0 ? _d : ''
                        });
                    }
                }))();
            });
        });
    }
    /*
     ** Get profile of a user in community
     */
    getCommunityUserProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    switch (this.community) {
                        case 'greenia':
                            const greeniaProfile = yield this.composeClient.executeQuery(`
              query {
                node(id: "${id}") {
                  ... on GreeniaProfile {
                    id
                  }
                }
              }
            `);
                            if (greeniaProfile.errors != null &&
                                greeniaProfile.errors.length > 0) {
                                reject(greeniaProfile);
                            }
                            else {
                                const _a = greeniaProfile.data.node, { id } = _a, rest = __rest(_a, ["id"]);
                                resolve(Object.assign(Object.assign({}, rest), { greeniaProfileId: greeniaProfile.data.node.id }));
                            }
                            break;
                        default:
                            reject('Wrong Community');
                    }
                }))();
            });
        });
    }
    /*
     ** Create a post
     */
    createPost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const create = yield this.composeClient.executeQuery(`
          mutation {
            createPost(input: {
              content: {
                body: "${params.body}",
                profileID: "${params.profileID}",
                attachment: "${params.attachment}",
                externalURL: "${params.externalURL}",
                isEncrypted: ${params.isEncrypted},
                ${params.tags.map((x, i) => `tag${i + 1}: "${x}",`)}
                createdAt: "${(0, dayjs_1.default)().toISOString()}",
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
                    }
                    else {
                        const _a = create.data.createPost.document, { tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10 } = _a, other = __rest(_a, ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"]);
                        resolve(Object.assign(Object.assign({}, other), { tags: [
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
                            ].filter((x) => x != null && x != '') }));
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    /*
     ** Update a post
     */
    updatePost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const update = yield this.composeClient.executeQuery(`
          mutation {
            updatePost(input: {
              id: "${params.id}",
              content: {
                body: "${params.body}",
                profileID: "${params.profileID}",
                attachment: "${params.attachment}",
                externalURL: "${params.externalURL}",
                isEncrypted: ${params.isEncrypted},
                unifiedAccessControlConditions: "${params.unifiedAccessControlConditions}",
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
                    }
                    else {
                        const _a = update.data.updatePost.document, { tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10 } = _a, other = __rest(_a, ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"]);
                        resolve(Object.assign(Object.assign({}, other), { tags: [
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
                            ].filter((x) => x != null && x != '') }));
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    /*
     ** Get the list of posts
     */
    getPosts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                try {
                    const list = yield this.composeClient.executeQuery(`
          query {
            postIndex(
              ${lodash_1.default.get(params, 'search.q', '') != ''
                        ? `filters: {
                      or: [
                        { where: { tag1: { equalTo: "${params.search.q}" ${params.search.profiles
                            ? `, profileID: { in: [${params.search.profiles
                                .map((x) => `"${x}"`)
                                .join(',')}] }`
                            : ''} } } },
                        { where: { tag2: { equalTo: "${params.search.q}" ${params.search.profiles
                            ? `, profileID: { in: [${params.search.profiles
                                .map((x) => `"${x}"`)
                                .join(',')}] }`
                            : ''} } } },
                        { where: { tag3: { equalTo: "${params.search.q}" ${params.search.profiles
                            ? `, profileID: { in: [${params.search.profiles
                                .map((x) => `"${x}"`)
                                .join(',')}] }`
                            : ''} } } },
                        { where: { tag4: { equalTo: "${params.search.q}" ${params.search.profiles
                            ? `, profileID: { in: [${params.search.profiles
                                .map((x) => `"${x}"`)
                                .join(',')}] }`
                            : ''} } } },
                        { where: { tag5: { equalTo: "${params.search.q}" ${params.search.profiles
                            ? `, profileID: { in: [${params.search.profiles
                                .map((x) => `"${x}"`)
                                .join(',')}] }`
                            : ''} } } },
                        { where: { tag6: { equalTo: "${params.search.q}" ${params.search.profiles
                            ? `, profileID: { in: [${params.search.profiles
                                .map((x) => `"${x}"`)
                                .join(',')}] }`
                            : ''} } } },
                        { where: { tag7: { equalTo: "${params.search.q}" ${params.search.profiles
                            ? `, profileID: { in: [${params.search.profiles
                                .map((x) => `"${x}"`)
                                .join(',')}] }`
                            : ''} } } },
                        { where: { tag8: { equalTo: "${params.search.q}" ${params.search.profiles
                            ? `, profileID: { in: [${params.search.profiles
                                .map((x) => `"${x}"`)
                                .join(',')}] }`
                            : ''} } } },
                        { where: { tag9: { equalTo: "${params.search.q}" ${params.search.profiles
                            ? `, profileID: { in: [${params.search.profiles
                                .map((x) => `"${x}"`)
                                .join(',')}] }`
                            : ''} } } },
                        { where: { tag10: { equalTo: "${params.search.q}" ${params.search.profiles
                            ? `, profileID: { in: [${params.search.profiles
                                .map((x) => `"${x}"`)
                                .join(',')}] }`
                            : ''} } } }
                      ]
                    },`
                        : ''}
              ${lodash_1.default.get(params, 'search.profiles', []).length > 0
                        ? `filters: {
                      where: { profileID: { in: [${params.search.profiles
                            .map((x) => `"${x}"`)
                            .join(',')}] } }
                    },`
                        : ''}
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
                    }
                    else {
                        resolve({
                            posts: list.data.postIndex.edges.map((x) => {
                                const _a = x.node, { tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10, likes, comments } = _a, other = __rest(_a, ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "likes", "comments"]);
                                return Object.assign(Object.assign({}, other), { tags: [
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
                                    ].filter((x) => x != null && x != ''), likes: lodash_1.default.get(likes, 'edges', []).map((x) => x.node), comments: lodash_1.default.get(comments, 'edges', []).map((x) => x.node) });
                            }),
                            cursor: (_d = (_c = (_b = (_a = list.data) === null || _a === void 0 ? void 0 : _a.postIndex) === null || _b === void 0 ? void 0 : _b.edges.at(-1)) === null || _c === void 0 ? void 0 : _c.cursor) !== null && _d !== void 0 ? _d : ''
                        });
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    /*
     ** Get a post by ID
     */
    getPost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const post = yield this.composeClient.executeQuery(`
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
                    }
                    else {
                        const _a = post.data.node, { tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10, likes, comments } = _a, other = __rest(_a, ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "likes", "comments"]);
                        resolve(Object.assign(Object.assign({}, other), { tags: [
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
                            ].filter((x) => x != null && x != ''), likes: lodash_1.default.get(likes, 'edges', []).map((x) => x.node), comments: lodash_1.default.get(comments, 'edges', []).map((x) => x.node) }));
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    /*
     ** Get or create chat
     */
    getOrCreateChat(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const chats = yield this.composeClient.executeQuery(`
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
                }
                else {
                    if (chats.data.chatIndex.edges.length > 0) {
                        const chat = chats.data.chatIndex.edges[0];
                        resolve(Object.assign(Object.assign({}, chat.node), { messages: lodash_1.default.get(chat.node, 'messages.edges', []).map((x) => x.node) }));
                    }
                    else {
                        const create = yield this.composeClient.executeQuery(`
              mutation {
                createChat(input: {
                  content: {
                    profileID: "${params.profileID}",
                    recipientProfileID: "${params.recipientProfileID}",
                    channelID: "${params.channelID}",
                    isDeleted: false,
                    createdAt: "${(0, dayjs_1.default)().toISOString()}",
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
                        }
                        else {
                            resolve(Object.assign(Object.assign({}, create.data.createChat.document), { messages: [] }));
                        }
                    }
                }
            }));
        });
    }
    /*
     ** Get chats of user
     */
    getChats(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    const chats = yield this.composeClient.executeQuery(`
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
                    }
                    else {
                        if (chats.data.chatIndex.edges.length > 0) {
                            resolve({
                                chats: chats.data.chatIndex.edges.map((x) => {
                                    return Object.assign(Object.assign({}, x.node), { messages: lodash_1.default.get(x.node, 'messages.edges', []).map((x) => x.node) });
                                }),
                                cursor: (_d = (_c = (_b = (_a = chats.data) === null || _a === void 0 ? void 0 : _a.chatIndex) === null || _b === void 0 ? void 0 : _b.edges.at(-1)) === null || _c === void 0 ? void 0 : _c.cursor) !== null && _d !== void 0 ? _d : ''
                            });
                        }
                        else {
                            resolve(null);
                        }
                    }
                }))();
            });
        });
    }
    /*
     ** Send a message
     */
    sendMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let body = params.content;
                    if (params.publicEncryptionDIDs != null &&
                        params.publicEncryptionDIDs.length > 0) {
                        if (this.encryptionDid) {
                            console.log('jwe', 'startiiiing');
                            const jwe = yield this.encryptionDid.createDagJWE({ body }, params.publicEncryptionDIDs);
                            console.log('jwe', jwe);
                            body = JSON.stringify(jwe).replace(/"/g, '`');
                        }
                        else {
                            reject('Encryption DID is not set');
                        }
                    }
                    console.log('params.publicEncryptionDIDs', params.publicEncryptionDIDs);
                    console.log('this.encryptionDid', this.encryptionDid);
                    console.log('body', body);
                    const create = yield this.composeClient.executeQuery(`
          mutation {
            createChatMessage(input: {
              content: {
                body: "${body}",
                profileID: "${params.profileID}",
                chatID: "${params.chatID}",
                messageType: "${params.messageType}",
                createdAt: "${(0, dayjs_1.default)().toISOString()}",
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
                    }
                    else {
                        resolve(create.data.createChatMessage.document);
                    }
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
}
exports.default = Allostasis;
