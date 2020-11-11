import React, { FC, useContext } from 'react';

import { Grid } from '@acala-dapp/ui-components';

import { LoanContext } from './LoanProvider';
import { DebitConsole, CollateralConsole } from './OperatorConsole';
import { LiquidationPriceCard } from './LiquidationPriceCard';
import { LiquidationRatioCard } from './LiquidationRatioCard';

export const LoanConsole: FC = () => {
  const { currentTab } = useContext(LoanContext);

  if (typeof currentTab === 'string') return null;

  return (
    <Grid container>
      <Grid item
        span={12}>
        <LiquidationPriceCard currency={currentTab} />
      </Grid>
      <Grid item
        span={12}>
        <LiquidationRatioCard currency={currentTab} />
      </Grid>
      <Grid item
        span={12}>
        <DebitConsole currency={currentTab} />
      </Grid>
      <Grid item
        span={12}>
        <CollateralConsole currency={currentTab} />
      </Grid>
    </Grid>
  );
};
