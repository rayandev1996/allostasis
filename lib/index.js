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
const file_1 = require("./utils/file");
const ethers_1 = require("ethers");
const PushAPI = __importStar(require("@pushprotocol/restapi"));
const constants_1 = require("@pushprotocol/restapi/src/lib/constants");
class Allostasis {
    constructor(community, options) {
        this.nodeURL = options.nodeURL;
        this.community = community;
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
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    const store = new store_1.Store();
                    yield this.lit.connect();
                    try {
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
                            this.ethersProvider.send("eth_requestAccounts", []).then(() => __awaiter(this, void 0, void 0, function* () {
                                yield this.ceramic.setDID(session.did);
                                this.composeClient.setDID(session.did);
                                this.ethersSigner = this.ethersProvider.getSigner();
                                this.ethersAddress = address;
                                console.log('Allostasis', 'Getting user');
                                const gotUser = yield PushAPI.user.get({ account: this.ethersAddress, env: constants_1.ENV.STAGING });
                                console.log('Allostasis', gotUser);
                                if (gotUser) {
                                    this.chatUser = gotUser;
                                }
                                else {
                                    const createUser = yield PushAPI.user.create({ account: this.ethersAddress, env: constants_1.ENV.STAGING });
                                    console.log('Allostasis', 'Creating user');
                                    console.log('Allostasis', createUser);
                                    this.chatUser = createUser;
                                }
                                this.pvtKey = yield PushAPI.chat.decryptPGPKey({
                                    encryptedPGPPrivateKey: (this.chatUser).encryptedPrivateKey,
                                    account: this.ethersAddress,
                                    signer: this.ethersSigner,
                                    env: constants_1.ENV.STAGING,
                                    toUpgrade: true,
                                });
                                resolve({ did: session.did.id, address: address !== null && address !== void 0 ? address : '' });
                            })).catch((e) => {
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
                        this.ethersProvider.send("eth_requestAccounts", []).then(() => __awaiter(this, void 0, void 0, function* () {
                            yield this.ceramic.setDID(session.did);
                            this.composeClient.setDID(session.did);
                            this.ethersSigner = this.ethersProvider.getSigner();
                            this.ethersAddress = address;
                            console.log('Allostasis', 'Getting user');
                            const gotUser = yield PushAPI.user.get({ account: this.ethersAddress, env: constants_1.ENV.STAGING });
                            console.log('Allostasis', gotUser);
                            if (gotUser) {
                                this.chatUser = gotUser;
                            }
                            else {
                                const createUser = yield PushAPI.user.create({ account: this.ethersAddress, env: constants_1.ENV.STAGING });
                                console.log('Allostasis', 'Creating user');
                                console.log('Allostasis', createUser);
                                this.chatUser = createUser;
                            }
                            this.pvtKey = yield PushAPI.chat.decryptPGPKey({
                                encryptedPGPPrivateKey: (this.chatUser).encryptedPrivateKey,
                                account: this.ethersAddress,
                                signer: this.ethersSigner,
                                env: constants_1.ENV.STAGING,
                                toUpgrade: true,
                            });
                            resolve({ did: session.did.id, address: address !== null && address !== void 0 ? address : '' });
                        })).catch((e) => {
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
                                    const createGreenia = yield this.composeClient.executeQuery(`
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
                                    if (createGreenia.errors != null &&
                                        createGreenia.errors.length > 0) {
                                        reject(createGreenia);
                                    }
                                    else {
                                        resolve(Object.assign(Object.assign(Object.assign({}, create.data.createProfile.document), createGreenia.data.createGreeniaProfile.document), { id: create.data.createProfile.document.id, greeniaProfileId: createGreenia.data.createGreeniaProfile.document.id }));
                                    }
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
    getProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
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
                        }
                        else {
                            if (((_b = (_a = profile.data) === null || _a === void 0 ? void 0 : _a.viewer) === null || _b === void 0 ? void 0 : _b.profile) != null) {
                                const profileData = Object.assign(Object.assign({}, (_d = (_c = profile.data) === null || _c === void 0 ? void 0 : _c.viewer) === null || _d === void 0 ? void 0 : _d.profile), { chats: lodash_1.default.get(profile.data.viewer.profile, 'chats.edges', []).map((i) => i.node), receivedChats: lodash_1.default.get(profile.data.viewer.profile, 'receivedChats.edges', []).map((i) => i.node), educations: lodash_1.default.get(profile.data.viewer.profile, 'educations.edges', []).map((i) => i.node), experiences: lodash_1.default.get(profile.data.viewer.profile, 'experiences.edges', []).map((i) => i.node), posts: lodash_1.default.get(profile.data.viewer.profile, 'posts.edges', []).map((i) => i.node) });
                                switch (this.community) {
                                    case 'greenia':
                                        const greeniaProfile = yield this.composeClient.executeQuery(`
                    query {
                      viewer {
                        greeniaProfile {
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
                                            if (((_f = (_e = greeniaProfile.data) === null || _e === void 0 ? void 0 : _e.viewer) === null || _f === void 0 ? void 0 : _f.greeniaProfile) != null) {
                                                resolve(Object.assign(Object.assign(Object.assign({}, profileData), (_h = (_g = greeniaProfile.data) === null || _g === void 0 ? void 0 : _g.viewer) === null || _h === void 0 ? void 0 : _h.greeniaProfile), { id: profileData.id, greeniaProfileId: (_k = (_j = greeniaProfile.data) === null || _j === void 0 ? void 0 : _j.viewer) === null || _k === void 0 ? void 0 : _k.greeniaProfile.id }));
                                            }
                                            else {
                                                reject(greeniaProfile);
                                            }
                                        }
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
                    }
                    else {
                        resolve(Object.assign(Object.assign({}, profile.data.node), { chats: lodash_1.default.get(profile.data.node.chats, 'edges', []).map((i) => i.node), receivedChats: lodash_1.default.get(profile.data.node.receivedChats, 'edges', []).map((i) => i.node) }));
                    }
                }))();
            });
        });
    }
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
    getChats() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        // resolve(this.chatUser.chat.list("CHATS"));
                    }
                    catch (e) {
                        reject(e);
                    }
                }))();
            });
        });
    }
    createChat(recipient) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    getChatHistory(recipient) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // this.chatUser.chat.history(recipient).then(res => {
                //   resolve(res)
                // }).catch(err => {
                //   reject(err)
                // })
            });
        });
    }
    sendChatMessage(recipient, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // return this.chatUser.chat.send(recipient, message).then(res => {
                //   resolve(res)
                // }).catch(err => {
                //   reject(err)
                // })
            });
        });
    }
    sendChatMessageFile(file, chatId, profileId, userAddress, recipientAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        (0, file_1.MyBlobToBuffer)(file, (err, buff) => __awaiter(this, void 0, void 0, function* () {
                            var _a, _b;
                            if (err) {
                                reject(err);
                            }
                            else {
                                let upload;
                                if (buff != null) {
                                    upload = yield ((_a = this.ipfs) === null || _a === void 0 ? void 0 : _a.add(buff));
                                }
                                const filePath = (_b = upload === null || upload === void 0 ? void 0 : upload.path) !== null && _b !== void 0 ? _b : '';
                                const encryption = yield (0, lit_1.encryptString)(filePath, (0, lit_1.chatMessageAccessControlGenerator)(userAddress, recipientAddress), this.chain, this.lit);
                                if (encryption) {
                                    const message = yield this.composeClient.executeQuery(`
                  mutation {
                    createChatMessage(input: {
                      content: {
                        messageType: "file",
                        chatID: "${chatId}",
                        profileID: "${profileId}",
                        createdAt: "${(0, dayjs_1.default)().toISOString()}",
                        body: "${encryption.encryptedContent}",
                        unifiedAccessControlConditions: "${encryption.unifiedAccessControlConditions}",
                        encryptedSymmetricKey: "${encryption.encryptedSymmetricKey}"
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
                                    }
                                    else {
                                        resolve(message.data.createChatMessage.document);
                                    }
                                }
                                else {
                                    reject('Cannot encrypt message');
                                }
                            }
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }))();
            });
        });
    }
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
}
exports.default = Allostasis;
