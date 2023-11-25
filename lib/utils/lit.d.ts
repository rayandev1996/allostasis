import { Chain } from '../types/allostasis';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { UnifiedAccessControlConditions } from '@lit-protocol/types/src/lib/types';
import { Store } from './store';
export declare function encryptString(content: string, unifiedAccessControlConditions: UnifiedAccessControlConditions, chain: Chain, lit: LitNodeClient): Promise<{
    encryptedContent: string;
    encryptedSymmetricKey: string;
    unifiedAccessControlConditions: string;
}>;
export declare function blobToBase64(blob: any): Promise<string>;
export declare function buf2hex(buffer: any): string;
export declare function getAuthSig(store: Store): Promise<any>;
export declare function decodeB64(b64String: string): Uint8Array;
export declare function chatMessageAccessControlGenerator(userAddress: string, recipientUserAddress: string): UnifiedAccessControlConditions;
