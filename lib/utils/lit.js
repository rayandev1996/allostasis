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
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMessageAccessControlGenerator = exports.decodeB64 = exports.getAuthSig = exports.buf2hex = exports.blobToBase64 = exports.encryptString = void 0;
const LitJsSdk = __importStar(require("@lit-protocol/lit-node-client"));
function encryptString(content, unifiedAccessControlConditions, chain, lit) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { encryptedString, symmetricKey } = yield LitJsSdk.encryptString(content);
                    const authSig = yield LitJsSdk.checkAndSignAuthMessage({
                        chain: chain.name
                    });
                    const encryptedSymmetricKey = yield lit.saveEncryptionKey({
                        unifiedAccessControlConditions,
                        symmetricKey,
                        authSig,
                        chain: chain.name
                    });
                    resolve({
                        encryptedContent: yield blobToBase64(encryptedString),
                        encryptedSymmetricKey: buf2hex(encryptedSymmetricKey),
                        unifiedAccessControlConditions: btoa(JSON.stringify(unifiedAccessControlConditions))
                    });
                }
                catch (e) {
                    reject(e);
                }
            }))();
        });
    });
}
exports.encryptString = encryptString;
function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            var _a;
            return resolve(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (_a = reader.result) === null || _a === void 0 ? void 0 : _a.replace("data:application/octet-stream;base64,", ""));
        };
        reader.readAsDataURL(blob);
    });
}
exports.blobToBase64 = blobToBase64;
function buf2hex(buffer) {
    return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
}
exports.buf2hex = buf2hex;
function getAuthSig(store) {
    return __awaiter(this, void 0, void 0, function* () {
        const _authSig = yield store.getItem("lit-auth-signature");
        const authSig = JSON.parse(_authSig !== null && _authSig !== void 0 ? _authSig : '');
        if (authSig && authSig != "") {
            return authSig;
        }
        else {
            throw new Error("User not authenticated to Lit Protocol for messages");
        }
    });
}
exports.getAuthSig = getAuthSig;
function decodeB64(b64String) {
    return new Uint8Array(Buffer.from(b64String, "base64"));
}
exports.decodeB64 = decodeB64;
function chatMessageAccessControlGenerator(userAddress, recipientUserAddress) {
    const accessControls = [];
    accessControls.push({
        conditionType: "evmBasic",
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
            comparator: '=',
            value: userAddress
        }
    });
    accessControls.push({ operator: 'or' });
    accessControls.push({
        conditionType: "evmBasic",
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
            comparator: '=',
            value: recipientUserAddress
        }
    });
    return accessControls;
}
exports.chatMessageAccessControlGenerator = chatMessageAccessControlGenerator;
