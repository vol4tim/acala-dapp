import React, { FC, useContext } from 'react';

import { Grid } from '@acala-dapp/ui-components';

import { LoanContext } from './LoanProvider';
import { DebitConsole, CollateralConsole } from './OperatorConsole';
import { LiquidationPriceCard } from './LiquidationPriceCard';
import { LiquidationRatioCard } from './LiquidationRatioCard';

export const LoanConsole: FC = () => {
  const { currentTab } = useContext(LoanContext);

  return (
    <Grid container
      direction='column'>
      <Grid alignItems='stretch'
        container
        item>
        <Grid item
          xs={6}>
          <LiquidationPriceCard currency={currentTab} />
        </Grid>
        <Grid item
          xs={6}>
          <LiquidationRatioCard currency={currentTab} />
        </Grid>
      </Grid>
      <Grid container
        item>
        <Grid item
          xs={6}>
          <DebitConsole currency={currentTab} />
        </Grid>
        <Grid item
          xs={6}>
          <CollateralConsole currency={currentTab} />
        </Grid>
      </Grid>
    </Grid>
  );
};
