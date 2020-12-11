import React, { createContext, FC, useState, Dispatch, SetStateAction } from 'react';
import { BareProps } from '@acala-dapp/ui-components/types';

type Tab = 'acala' | 'cross-chain';

export interface WalletContextData {
  activeTab: Tab;
  changeActiveTab: Dispatch<SetStateAction<Tab>>;
}

export const WalletContext = createContext<WalletContextData>({} as WalletContextData);

export const WalletProvider: FC<BareProps> = ({ children }) => {
  const [activeTab, changeActiveTab] = useState<Tab>('acala');

  return (
    <WalletContext.Provider value={{
      activeTab,
      changeActiveTab
    }} >
      {children}
    </WalletContext.Provider>
  );
};
