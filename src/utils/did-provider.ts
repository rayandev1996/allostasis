import { Chain } from '../types/allostasis';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';

export async function getAuthMethod(
  provider: any,
  chain: Chain
): Promise<{ authMethod: any; address: string }> {
  return new Promise((resolve, reject) => {
    (async () => {
      let addresses;
      try {
        addresses = await provider.enable();
      } catch (e) {
        reject(false);
      }

      const defaultChain = chain.code;
      const address = addresses[0].toLowerCase();
      const accountId = await getAccountId(provider, address);

      accountId.chainId.reference = defaultChain.toString();

      try {
        const authMethod = await EthereumWebAuth.getAuthMethod(
          provider,
          accountId
        );

        resolve({
          authMethod: authMethod,
          address: address
        });
      } catch (e) {
        reject(e);
      }
    })();
  });
}

export function getAddressFromDid(did: string) {
  if(did) {
    const didParts = did.split(":");

    if(did.substring(0, 7) == "did:pkh") {
      /** Explode address to retrieve did */
      if(didParts.length >= 4) {
        const address = didParts[4];
        const network = didParts[2];
        const chain = didParts[2] + ":" + didParts[3];

        /** Return result */
        return {
          address: address,
          network: network,
          chain: chain
        }
      } else {
        /** Return null object */
        return {
          address: null,
          network: null,
          chain: null
        }
      }
    } else if(did.substring(0, 7) == "did:key") {
      /** Return did object */
      return {
        address: didParts[2],
        network: 'key',
        chain: 'key'
      }
    } else {
      /** Return null object */
      return {
        address: null,
        network: null,
        chain: null
      }
    }
  } else {
    /** Return null object */
    return {
      address: null,
      network: null,
      chain: null
    }
  }
}
