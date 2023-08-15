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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressFromDid = exports.getAuthMethod = void 0;
const pkh_ethereum_1 = require("@didtools/pkh-ethereum");
function getAuthMethod(provider, chain) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                let addresses;
                try {
                    addresses = yield provider.enable();
                }
                catch (e) {
                    reject(false);
                }
                const defaultChain = chain.code;
                const address = addresses[0].toLowerCase();
                const accountId = yield (0, pkh_ethereum_1.getAccountId)(provider, address);
                accountId.chainId.reference = defaultChain.toString();
                try {
                    const authMethod = yield pkh_ethereum_1.EthereumWebAuth.getAuthMethod(provider, accountId);
                    resolve({
                        authMethod: authMethod,
                        address: address
                    });
                }
                catch (e) {
                    reject(e);
                }
            }))();
        });
    });
}
exports.getAuthMethod = getAuthMethod;
function getAddressFromDid(did) {
    if (did) {
        const didParts = did.split(":");
        if (did.substring(0, 7) == "did:pkh") {
            /** Explode address to retrieve did */
            if (didParts.length >= 4) {
                const address = didParts[4];
                const network = didParts[2];
                const chain = didParts[2] + ":" + didParts[3];
                /** Return result */
                return {
                    address: address,
                    network: network,
                    chain: chain
                };
            }
            else {
                /** Return null object */
                return {
                    address: null,
                    network: null,
                    chain: null
                };
            }
        }
        else if (did.substring(0, 7) == "did:key") {
            /** Return did object */
            return {
                address: didParts[2],
                network: 'key',
                chain: 'key'
            };
        }
        else {
            /** Return null object */
            return {
                address: null,
                network: null,
                chain: null
            };
        }
    }
    else {
        /** Return null object */
        return {
            address: null,
            network: null,
            chain: null
        };
    }
}
exports.getAddressFromDid = getAddressFromDid;
