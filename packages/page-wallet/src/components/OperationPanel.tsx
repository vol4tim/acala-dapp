import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Tabs } from '@acala-dapp/ui-components';

import { WalletContext } from './WalletProvider';
import { AcalaConsole } from './AcalaConsole';
import { CrossChainConsole } from './CrossChainConsole';

export const OperationPanel: FC = () => {
  const { t } = useTranslation('page-wallet');
  const { activeTab, changeActiveTab } = useContext(WalletContext);

  return (
    <Tabs
      defaultKey={activeTab}
      onChange={changeActiveTab}
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
        tab={t('Cross-Chain')}
      >
        <CrossChainConsole />
      </Tabs.Panel>
    </Tabs>
  );
};
