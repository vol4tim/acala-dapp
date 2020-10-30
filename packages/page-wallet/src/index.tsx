import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Page } from '@acala-dapp/ui-components';
import { WalletProvider } from './components/WalletProvider';
import { Tabs } from './components/Tabs';

const PageWallet: FC = () => {
  const { t } = useTranslation('page-wallet');

  return (
    <WalletProvider>
      <Page>
        <Page.Title title={t('Wallet')} />
        <Page.Content>
          <Tabs />
        </Page.Content>
      </Page>
    </WalletProvider>
  );
};

export default PageWallet;
