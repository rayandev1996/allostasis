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
                console.log('An ethereum provider is required to proceed with the connection to Ceramic.');
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
                            yield this.ceramic.setDID(session.did);
                            this.composeClient.setDID(session.did);
                            resolve({ did: session.did.id, address: address !== null && address !== void 0 ? address : '' });
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
                        yield this.ceramic.setDID(session.did);
                        this.composeClient.setDID(session.did);
                        resolve({ did: session.did.id, address: address !== null && address !== void 0 ? address : '' });
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
                            .filter((x) => x === 'name' || x === 'email' || x === 'avatar')
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
                        }
                        else {
                            switch (this.community) {
                                case 'greenia':
                                    const createGreenia = yield this.composeClient.executeQuery(`
                  mutation {
                    createGreeniaProfile(input: {
                      content:{
                        profileID: "${create.data.createProfile.document.id}",
                        ${Object.keys(params)
                                        .filter((x) => x === 'cover' || x === 'bio' || x === 'skills')
                                        .map((key) => {
                                        if (key === 'skills') {
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
                        cover
                        bio
                        skills
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
                  name
                  email
                  avatar
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
                                const profileData = Object.assign(Object.assign({}, (_d = (_c = profile.data) === null || _c === void 0 ? void 0 : _c.viewer) === null || _d === void 0 ? void 0 : _d.profile), { chats: lodash_1.default.get(profile.data.viewer.profile, 'chats.edges', []).map((i) => i.node), receivedChats: lodash_1.default.get(profile.data.viewer.profile, 'receivedChats.edges', []).map((i) => i.node) });
                                switch (this.community) {
                                    case 'greenia':
                                        const greeniaProfile = yield this.composeClient.executeQuery(`
                    query {
                      viewer {
                        greeniaProfile {
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
                                        if (greeniaProfile.errors != null &&
                                            greeniaProfile.errors.length > 0) {
                                            reject(greeniaProfile);
                                        }
                                        else {
                                            if (((_f = (_e = greeniaProfile.data) === null || _e === void 0 ? void 0 : _e.viewer) === null || _f === void 0 ? void 0 : _f.greeniaProfile) != null) {
                                                resolve(Object.assign(Object.assign(Object.assign({}, profileData), (_h = (_g = greeniaProfile.data) === null || _g === void 0 ? void 0 : _g.viewer) === null || _h === void 0 ? void 0 : _h.greeniaProfile), { id: profileData.id, greeniaProfileId: (_k = (_j = greeniaProfile.data) === null || _j === void 0 ? void 0 : _j.viewer) === null || _k === void 0 ? void 0 : _k.greeniaProfile.id, educations: lodash_1.default.get(greeniaProfile.data.viewer.greeniaProfile, 'educations.edges', []).map((i) => i.node), experiences: lodash_1.default.get(greeniaProfile.data.viewer.greeniaProfile, 'experiences.edges', []).map((i) => i.node), articles: lodash_1.default.get(greeniaProfile.data.viewer.greeniaProfile, 'articles.edges', []).map((i) => i.node) }));
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
                name
                email
                avatar
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
                            if (greeniaProfile.errors != null &&
                                greeniaProfile.errors.length > 0) {
                                reject(greeniaProfile);
                            }
                            else {
                                const _a = greeniaProfile.data.node, { id } = _a, rest = __rest(_a, ["id"]);
                                resolve(Object.assign(Object.assign({}, rest), { greeniaProfileId: greeniaProfile.data.node.id, educations: lodash_1.default.get(greeniaProfile.data.node, 'educations.edges', []).map((i) => i.node), experiences: lodash_1.default.get(greeniaProfile.data.node, 'experiences.edges', []).map((i) => i.node), articles: lodash_1.default.get(greeniaProfile.data.node, 'articles.edges', []).map((i) => i.node) }));
                            }
                            break;
                        default:
                            reject('Wrong Community');
                    }
                }))();
            });
        });
    }
    createChat(me, recipient) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const user = yield this.getUserProfile(me);
                        const iHaveCreatedBefore = user.chats.find((x) => x.recipientProfileID === recipient);
                        const theyHaveCreatedBefore = user.receivedChats.find((x) => x.profileID === recipient);
                        if (iHaveCreatedBefore != null) {
                            resolve(iHaveCreatedBefore);
                        }
                        else if (theyHaveCreatedBefore != null) {
                            resolve(theyHaveCreatedBefore);
                        }
                        else {
                            const chat = yield this.composeClient.executeQuery(`
              mutation {
                createChat(input: {
                  content:{
                    profileID: "${user.id}",
                    recipientProfileID: "${recipient}",
                    createdAt: "${(0, dayjs_1.default)().toISOString()}",
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
                            }
                            else {
                                resolve(chat.data.createChat.document);
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
    getChat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const chat = yield this.composeClient.executeQuery(`
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
                  messages(last: 300) {
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
                        }
                        else {
                            resolve(Object.assign(Object.assign({}, chat.data.node), { messages: chat.data.node.messages.edges.map((node) => node.node) }));
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                }))();
            });
        });
    }
    sendChatMessage(content, chatId, profileId, userAddress, recipientAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const encryption = yield (0, lit_1.encryptString)(content, (0, lit_1.chatMessageAccessControlGenerator)(userAddress, recipientAddress), this.chain, this.lit);
                        if (encryption) {
                            const message = yield this.composeClient.executeQuery(`
              mutation {
                createChatMessage(input: {
                  content:{
                    messageType: "text",
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
                    catch (e) {
                        reject(e);
                    }
                }))();
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
