import React, { FC } from 'react';

import { Grid } from '@acala-dapp/ui-components';

import { StakingOverview } from './StakingOverview';
import { ExpressConsole } from './ExpressConsole';

export const Express: FC = () => {
  return (
    <Grid container>
      <Grid item>
        <StakingOverview />
      </Grid>
      <Grid item>
        <ExpressConsole />
      </Grid>
    </Grid>
  );
};
