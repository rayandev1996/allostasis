import { Chain } from '../types/allostasis';
export declare function getAuthMethod(provider: any, chain: Chain): Promise<{
    authMethod: any;
    address: string;
}>;
export declare function getAddressFromDid(did: string): {
    address: string;
    network: string;
    chain: string;
};
