import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';

import { CDPCOllateralRatio } from './components/CDPCollateralRatio';
import { TotalDebitAndCollateral } from './components/TotalDebitAndCollateral';

const PageWallet: FC = () => {
  return (
    <Page>
      <Page.Title title='Loans Overview' />
      <Page.Content>
        <Grid container
          direction='column'>
          <Grid item>
            <TotalDebitAndCollateral />
          </Grid>
          <CDPCOllateralRatio />
        </Grid>
      </Page.Content>
    </Page>
  );
};

export default PageWallet;
