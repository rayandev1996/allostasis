"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const LitJsSdk = __importStar(require("@lit-protocol/lit-node-client"));
const definition_1 = require("./constants/definition");
const store_1 = require("./utils/store");
const did_provider_1 = require("./utils/did-provider");
const did_session_1 = require("did-session");
const providers_1 = require("@ethersproject/providers");
const auth_browser_1 = require("@lit-protocol/auth-browser");
const lodash_1 = __importDefault(require("lodash"));
const dayjs_1 = __importDefault(require("dayjs"));
const lit_1 = require("./utils/lit");
const kubo_rpc_client_1 = require("kubo-rpc-client");
const ethers_1 = require("ethers");
const PushAPI = __importStar(require("@pushprotocol/restapi"));
const constants_1 = require("@pushprotocol/restapi/src/lib/constants");
class Allostasis {
    constructor(community, options) {
        var _a;
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
                var _b, _c;
                try {
                    const create = yield this.composeClient.executeQuery(`
          mutation {
            createPostComment(input: {
              content: {
                content: "${params.content}",
                postID: "${params.postID}",
                profileID: "${params.profileID}",
                createdAt: "${(0, dayjs_1.default)().toISOString()}",
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
                    }
                    else {
                        resolve((_c = (_b = create.data) === null || _b === void 0 ? void 0 : _b.createPostComment) === null || _c === void 0 ? void 0 : _c.document);
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
          }
        `);
                    if (liked.errors != null && liked.errors.length > 0) {
                        reject(liked);
                    }
                    else {
                        if (liked.data.postLikesIndex.edges.length > 0) {
                            if (liked.data.postLikesIndex.edges[0].node.isDeleted) {
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
          }
        `);
                    if (followed.errors != null && followed.errors.length > 0) {
                        reject(followed);
                    }
                    else {
                        if (followed.data.followsIndex.edges.length > 0) {
                            if (followed.data.followsIndex.edges[0].node.isDeleted) {
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
        this.nodeURL = options.nodeURL;
        this.community = community;
        this.connectPush = (_a = options.connectPush) !== null && _a !== void 0 ? _a : true;
        if (options.chain) {
            this.chain = options.chain;
        }
        else {
            this.chain = { name: 'mumbai', id: 80001 };
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
        this.ceramic = new http_client_1.CeramicClient(options.nodeURL);
        this.composeClient = new client_1.ComposeClient({
            ceramic: options.nodeURL,
            definition: definition_1.definition
        });
        this.lit = new LitJsSdk.LitNodeClient({
            alertWhenUnauthorized: false,
            debug: false
        });
        this.ipfs = (0, kubo_rpc_client_1.create)({
            url: lodash_1.default.get(options, 'infura.url', ''),
            headers: {
                authorization: 'Basic ' +
                    btoa(lodash_1.default.get(options, 'infura.projectId', '') +
                        ':' +
                        lodash_1.default.get(options, 'infura.apiKey', ''))
            }
        });
        this.ethersProvider = new ethers_1.ethers.providers.Web3Provider(this.provider);
    }
    /*
     ** Connect the user
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    const store = new store_1.Store();
                    yield this.lit.connect();
                    try {
                        yield this.provider.request({
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
                        yield this.provider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: `0x${this.chain.id.toString(16)}` }]
                        });
                        const { authMethod, address } = yield (0, did_provider_1.getAuthMethod)(this.provider, this.chain);
                        if (authMethod != null) {
                            const session = yield did_session_1.DIDSession.authorize(authMethod, {
                                resources: this.composeClient.resources
                            });
                            const sessionString = session.serialize();
                            yield store.setItem('ceramic-session', sessionString);
                            const _userAuthSig = yield store.getItem('lit-auth-signature-' + address);
                            if (_userAuthSig) {
                                yield store.setItem('lit-auth-signature', _userAuthSig);
                            }
                            if (!_userAuthSig ||
                                _userAuthSig == '' ||
                                _userAuthSig == undefined) {
                                const web3 = new providers_1.Web3Provider(this.provider);
                                const { chainId } = yield web3.getNetwork();
                                yield auth_browser_1.ethConnect.signAndSaveAuthMessage({
                                    web3,
                                    account: address,
                                    chainId,
                                    resources: null,
                                    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
                                });
                                const _authSig = yield store.getItem('lit-auth-signature');
                                const authSig = JSON.parse(_authSig !== null && _authSig !== void 0 ? _authSig : '');
                                if (authSig && authSig != '') {
                                    yield store.setItem('lit-auth-signature-' + address, JSON.stringify(authSig));
                                }
                            }
                            this.ethersProvider
                                .send('eth_requestAccounts', [])
                                .then(() => __awaiter(this, void 0, void 0, function* () {
                                yield this.ceramic.setDID(session.did);
                                this.composeClient.setDID(session.did);
                                this.ethersSigner = this.ethersProvider.getSigner();
                                this.ethersAddress = address;
                                console.log('Allostasis', 'Getting user');
                                if (this.connectPush) {
                                    const gotUser = yield PushAPI.user.get({
                                        account: this.ethersAddress,
                                        env: constants_1.ENV.STAGING
                                    });
                                    console.log('Allostasis', gotUser);
                                    if (gotUser) {
                                        this.chatUser = gotUser;
                                    }
                                    else {
                                        const createUser = yield PushAPI.user.create({
                                            account: this.ethersAddress,
                                            env: constants_1.ENV.STAGING
                                        });
                                        console.log('Allostasis', 'Creating user');
                                        console.log('Allostasis', createUser);
                                        this.chatUser = createUser;
                                    }
                                    this.pvtKey = yield PushAPI.chat.decryptPGPKey({
                                        encryptedPGPPrivateKey: this.chatUser.encryptedPrivateKey,
                                        account: this.ethersAddress,
                                        signer: this.ethersSigner,
                                        env: constants_1.ENV.STAGING,
                                        toUpgrade: true
                                    });
                                }
                                resolve({ did: session.did.id, address: address !== null && address !== void 0 ? address : '' });
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
                }))();
            });
        });
    }
    /*
     ** Disconnect the user
     */
    disconnect(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
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
                }))();
            });
        });
    }
    /*
     ** Check the connection status of the user
     */
    isConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    yield this.ceramic;
                    const store = new store_1.Store();
                    yield this.lit.connect();
                    const sessionString = yield store.getItem('ceramic-session');
                    /** Connect to Ceramic using the session previously stored */
                    try {
                        const session = yield did_session_1.DIDSession.fromSession(sessionString !== null && sessionString !== void 0 ? sessionString : '');
                        const { address } = (0, did_provider_1.getAddressFromDid)(session.id);
                        const _userAuthSig = yield store.getItem('lit-auth-signature-' + address);
                        if (_userAuthSig) {
                            yield store.setItem('lit-auth-signature', _userAuthSig);
                        }
                        this.ethersProvider
                            .send('eth_requestAccounts', [])
                            .then(() => __awaiter(this, void 0, void 0, function* () {
                            yield this.ceramic.setDID(session.did);
                            this.composeClient.setDID(session.did);
                            this.ethersSigner = this.ethersProvider.getSigner();
                            this.ethersAddress = address;
                            console.log('Allostasis', 'Getting user');
                            const gotUser = yield PushAPI.user.get({
                                account: this.ethersAddress,
                                env: constants_1.ENV.STAGING
                            });
                            console.log('Allostasis', gotUser);
                            if (gotUser) {
                                this.chatUser = gotUser;
                            }
                            else {
                                const createUser = yield PushAPI.user.create({
                                    account: this.ethersAddress,
                                    env: constants_1.ENV.STAGING
                                });
                                console.log('Allostasis', 'Creating user');
                                console.log('Allostasis', createUser);
                                this.chatUser = createUser;
                            }
                            this.pvtKey = yield PushAPI.chat.decryptPGPKey({
                                encryptedPGPPrivateKey: this.chatUser.encryptedPrivateKey,
                                account: this.ethersAddress,
                                signer: this.ethersSigner,
                                env: constants_1.ENV.STAGING,
                                toUpgrade: true
                            });
                            resolve({ did: session.did.id, address: address !== null && address !== void 0 ? address : '' });
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
                }))();
            });
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
                        console.log(Object.keys(params));
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
                            x === 'socialLinks')
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
                        }
                        else {
                            if (((_b = (_a = profile.data) === null || _a === void 0 ? void 0 : _a.viewer) === null || _b === void 0 ? void 0 : _b.profile) != null) {
                                const profileData = Object.assign(Object.assign({}, (_d = (_c = profile.data) === null || _c === void 0 ? void 0 : _c.viewer) === null || _d === void 0 ? void 0 : _d.profile), { educations: lodash_1.default.get(profile.data.viewer.profile, 'educations.edges', []).map((i) => i.node), experiences: lodash_1.default.get(profile.data.viewer.profile, 'experiences.edges', []).map((i) => i.node), posts: lodash_1.default.get(profile.data.viewer.profile, 'posts.edges', []).map((i) => i.node) });
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
                    }
                    else {
                        resolve(Object.assign({}, profile.data.node));
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
     ** Decrypt an encrypted content
     */
    decryptContent(content, unifiedAccessControlConditions, encryptedSymmetricKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const store = new store_1.Store();
                        const authSig = yield (0, lit_1.getAuthSig)(store);
                        const decodedString = (0, lit_1.decodeB64)(content);
                        const _access = JSON.parse(atob(unifiedAccessControlConditions));
                        const decryptedSymmetricKey = yield this.lit.getEncryptionKey({
                            unifiedAccessControlConditions: _access,
                            toDecrypt: encryptedSymmetricKey,
                            chain: `${this.chain.id}`,
                            authSig
                        });
                        const _blob = new Blob([decodedString]);
                        const decryptedString = yield LitJsSdk.decryptString(_blob, decryptedSymmetricKey);
                        resolve(decryptedString);
                    }
                    catch (e) {
                        reject(e);
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
                tags: [${params.tags.map((i) => `"${i}"`).join(',')}],
                createdAt: "${(0, dayjs_1.default)().toISOString()}",
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
                    }
                    else {
                        resolve(Object.assign({}, create.data.createPost.document));
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
                tags: [${params.tags.map((i) => `"${i}"`).join(',')}],
                createdAt: "${(0, dayjs_1.default)().toISOString()}",
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
                    }
                    else {
                        resolve(Object.assign({}, update.data.updatePost.document));
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
                    }
                    else {
                        resolve({
                            posts: list.data.postIndex.edges.map((x) => (Object.assign(Object.assign({}, x.node), { likes: lodash_1.default.get(x.node, 'likes.edges', []).map((x) => x.node), comments: lodash_1.default.get(x.node, 'comments.edges', []).map((x) => x.node) }))),
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
                    }
                    else {
                        resolve(Object.assign(Object.assign({}, post.data.node), { likes: lodash_1.default.get(post.data.node, 'likes.edges', []).map((x) => x.node), comments: lodash_1.default.get(post.data.node, 'comments.edges', []).map((x) => x.node) }));
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
