import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';

import { LoanCollateralRatio } from './components/LoanCollateralRatio';
import { LoanLiquidationRatio } from './components/LoanLiquidationRatio';
import { TotalDebitAndCollateral } from './components/TotalDebitAndCollateral';
import { LoansOverview } from './components/LoansOverview';

const PageWallet: FC = () => {
  return (
    <Page fullscreen>
      <Page.Title breadcrumb='Loans'
        title='Stablecoin' />
      <Page.Content>
        <Grid container>
          <Grid item>
            <TotalDebitAndCollateral />
          </Grid>
          <Grid item
            span={12}>
            <LoanCollateralRatio />
          </Grid>
          <Grid item
            span={12}>
            <LoanLiquidationRatio />
          </Grid>
          <Grid item>
            <LoansOverview />
          </Grid>
        </Grid>
      </Page.Content>
    </Page>
  );
};

export default PageWallet;
