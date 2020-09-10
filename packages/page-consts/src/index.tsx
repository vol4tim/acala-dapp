import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';
import { WalletBalance } from '@acala-dapp/react-components';

import { SelectAction } from './components/SelectAction';
import { DepositProvider } from './components/Provider';
import { Console } from './components/Console';
import { PoolOverview } from './components/PoolOverview';
import { Transaction } from './components/Transaction';
import { UserCard, SystemCard } from './components/InformationCard';

const PageDeposit: FC = () => {
  return (
    <DepositProvider>
      <Page>
        <Page.Title title='Deposit & Earn' />
        <Page.Content>
          <Grid container>
            <Grid item>
              <WalletBalance />
            </Grid>
            <Grid container
              item>
              <Grid item
                span={12}>
                <UserCard />
              </Grid>
              <Grid item
                span={12}>
                <SystemCard />
              </Grid>
            </Grid>
            <Grid item>
              <SelectAction />
            </Grid>
            <Grid item>
              <Console />
            </Grid>
            <Grid item>
              <PoolOverview />
            </Grid>
            <Grid item>
              <Transaction />
            </Grid>
          </Grid>
        </Page.Content>
      </Page>
    </DepositProvider>
  );
};

export default PageDeposit;
