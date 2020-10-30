import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Tabs as UITabs } from '@acala-dapp/ui-components';

import { WalletContext } from './WalletProvider';
import { AcalaConsole } from './AcalaConsole';
import { CrossChainConsole } from './CrossChainConsole';

export const Tabs: FC = () => {
  const { t } = useTranslation('page-wallet');
  const { activeTab, changeActiveTab } = useContext(WalletContext);

  return (
    <UITabs
      defaultKey={activeTab}
      onChange={changeActiveTab}
      type='button'
    >
      <UITabs.Panel
        key='acala'
        tab='Acala'
      >
        <AcalaConsole />
      </UITabs.Panel>
      <UITabs.Panel
        key='cross-chain'
        tab={t('Cross-Chain')}
      >
        <CrossChainConsole />
      </UITabs.Panel>
    </UITabs>
  );
};
