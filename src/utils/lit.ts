import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { Chain } from '../types/allostasis';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { UnifiedAccessControlConditions } from '@lit-protocol/types/src/lib/types';
import {Store} from "./store";

export async function encryptString(
  content: string,
  unifiedAccessControlConditions: UnifiedAccessControlConditions,
  chain: Chain,
  lit: LitNodeClient
): Promise<{
  encryptedContent: string;
  encryptedSymmetricKey: string;
  unifiedAccessControlConditions: string;
}> {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
          content
        );

        const authSig = await LitJsSdk.checkAndSignAuthMessage({
          chain: chain.name
        });

        const encryptedSymmetricKey = await lit.saveEncryptionKey({
          unifiedAccessControlConditions,
          symmetricKey,
          authSig,
          chain: chain.name
        });

        resolve({
          encryptedContent: await blobToBase64(encryptedString),
          encryptedSymmetricKey: buf2hex(encryptedSymmetricKey),
          unifiedAccessControlConditions: btoa(
            JSON.stringify(unifiedAccessControlConditions)
          )
        });
      } catch (e) {
        reject(e);
      }
    })();
  });
}

export function blobToBase64(blob: any): Promise<string> {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () =>
            resolve(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                reader.result?.replace("data:application/octet-stream;base64,", "")
            );
        reader.readAsDataURL(blob);
    });
}

export function buf2hex(buffer: any) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
}

export async function getAuthSig(store: Store) {
    const _authSig = await store.getItem("lit-auth-signature")
    const authSig = JSON.parse(_authSig ?? '');

    if(authSig && authSig != "") {
        return authSig;
    } else {
        throw new Error("User not authenticated to Lit Protocol for messages");
    }
}

export function decodeB64(b64String: string) {
    return new Uint8Array(Buffer.from(b64String, "base64"));
}

export function chatMessageAccessControlGenerator(userAddress: string, recipientUserAddress: string): UnifiedAccessControlConditions {
    const accessControls: UnifiedAccessControlConditions = []

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
    })

    accessControls.push({ operator: 'or' })

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
    })

    return accessControls;
}
