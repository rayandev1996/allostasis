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
