import { ApiProvider, Bridge, ChainName } from '@interlay/bridge/build';
import { useEffect, useState } from 'react';
import { firstValueFrom } from 'rxjs';

import { XCM_ADAPTERS } from '@/config/relay-chains';
import { BITCOIN_NETWORK } from '@/constants';

const XCMBridge = new Bridge({
  adapters: Object.values(XCM_ADAPTERS)
});

// MEMO: BitcoinNetwork type is not available on XCM bridge
const XCMNetwork = BITCOIN_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

// const useXCMBridge = (): { XCMProvider: ApiProvider; XCMBridge: Bridge } => {
const useXCMBridge = (): { XCMProvider: any; XCMBridge: any } => {
  const [XCMProvider, setXCMProvider] = useState<any>();

  useEffect(() => {
    const createBridge = async () => {
      const XCMProvider = new ApiProvider(XCMNetwork) as any;
      const chains = Object.keys(XCM_ADAPTERS) as ChainName[];

      // Check connection
      await firstValueFrom(XCMProvider.connectFromChain(chains, undefined));

      // Set Apis
      await Promise.all(
        chains.map((chain: ChainName) =>
          // TODO: Get rid of any casting - mismatch between ApiRx types
          XCMBridge.findAdapter(chain).setApi(XCMProvider.getApi(chain) as any)
        )
      );

      setXCMProvider(XCMProvider);
    };

    if (!XCMProvider) {
      createBridge();
    }
  }, [XCMProvider]);

  return { XCMProvider, XCMBridge };
};

export { useXCMBridge };
