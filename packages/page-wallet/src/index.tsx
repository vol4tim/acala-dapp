import React, { FC, useContext } from 'react';

import { Page, Tabs } from '@acala-dapp/ui-components';
import { AcalaConsole } from './components/AcalaConsole';
import { CrossChainConsole } from './components/CrossChainConsole';
import { WalletProvider, WalletContext } from './components/WalletContext';

const Inner: FC = () => {
  const { changeTab, tab } = useContext(WalletContext);

  return (
    <Page>
      <Page.Title title='Wallet' />
      <Page.Content>
        <Tabs
          defaultKey={tab}
          onChange={changeTab}
          type='button'
        >
          <Tabs.Panel
            key='acala'
            tab='Acala'
          >
            <AcalaConsole />
          </Tabs.Panel>
          <Tabs.Panel
            key='cross-chain'
            tab='Cross-chain'
          >
            <CrossChainConsole />
          </Tabs.Panel>
        </Tabs>
      </Page.Content>
    </Page>
  );
};

const PageWallet: FC = () => {
  return (
    <WalletProvider>
      <Inner />
    </WalletProvider>
  );
};

export default PageWallet;
