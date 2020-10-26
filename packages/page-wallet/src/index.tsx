import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Page } from '@acala-dapp/ui-components';
import { WalletProvider } from './components/WalletProvider';
import { OperationPanel } from './components/OperationPanel';

const PageWallet: FC = () => {
  const { t } = useTranslation('page-wallet');

  return (
    <WalletProvider>
      <Page>
        <Page.Title title={t('Wallet')} />
        <Page.Content>
          <OperationPanel />
        </Page.Content>
      </Page>
    </WalletProvider>
  );
};

export default PageWallet;
