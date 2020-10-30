import React, { createContext, FC } from 'react';

import { BareProps } from '@acala-dapp/ui-components/types';
import { useTabs } from '@acala-dapp/ui-components';

export type NFTType = 'acala_testnet';

interface NFTContextData {
  currentTab: NFTType;
  changeTabs: (type: NFTType) => void;
}

export const NFTContext = createContext<NFTContextData>({} as NFTContextData);

export const NFTProvider: FC<BareProps> = ({ children }) => {
  const { changeTabs, currentTab } = useTabs<NFTType>('acala_testnet');

  return (
    <NFTContext.Provider value={{
      changeTabs,
      currentTab
    }}>
      {children}
    </NFTContext.Provider>
  );
};
