import React, { createContext, FC, useState } from 'react';
import { BareProps } from '@acala-dapp/ui-components/types';

type TAB = 'acala' | 'cross-chain';

export interface WalletContextData {
  tab: TAB;
  changeTab: (tab: TAB) => void;
}

export const WalletContext = createContext<WalletContextData>({} as WalletContextData);

export const WalletProvider: FC<BareProps> = ({ children }) => {
  const [tab, setTab] = useState<TAB>('acala');

  return (
    <WalletContext.Provider value={{ changeTab: setTab, tab }} >
      {children}
    </WalletContext.Provider>
  );
};
