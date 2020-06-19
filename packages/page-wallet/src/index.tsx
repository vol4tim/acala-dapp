import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';

import { UserCard } from './components/UserCard';
import { AirDrop } from '@acala-dapp/react-components';
import { Transaction } from './components/Transaction';
import { WalletBalance } from './components/WalletBalance';

const PageWallet: FC = () => {
  return (
    <Page>
      <Page.Title title='Wallet' />
      <Page.Content>
        <Grid container
          direction='column'>
          <Grid item>
            <UserCard />
          </Grid>
          <Grid item>
            <WalletBalance />
          </Grid>
          <Grid item>
            <AirDrop />
          </Grid>
          <Grid item>
            <Transaction />
          </Grid>
        </Grid>
      </Page.Content>
    </Page>
  );
};

export default PageWallet;
