import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';

import { Tabs } from './components/Tabs';
import { LiquidityProvider } from './components/LiquidityProvider';
import { LiquidityInformation } from './components/LiquidityInformation';

const PageDeposit: FC = () => {
  return (
    <LiquidityProvider>
      <Page>
        <Page.Title title='Deposit & Earn' />
        <Page.Content>
          <Grid container>
            <Grid item>
              <Tabs />
            </Grid>
            <Grid item>
              <LiquidityInformation />
            </Grid>
          </Grid>
        </Page.Content>
      </Page>
    </LiquidityProvider>
  );
};

export default PageDeposit;
