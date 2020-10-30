import React, { FC } from 'react';

import { Grid } from '@acala-dapp/ui-components';

import { StakingTokeBalances } from './StakingTokenBalances';
import { SelectToken } from './SelectToken';
import { SystemInfo } from './SystemInfo';
import { Console } from './Console';
import { StakingPool } from './StakingPool';
import { Transaction } from './Transaction';
import { RedeemList } from './RedeemList';

export const Advanced: FC = () => {
  return (
    <Grid container>
      <Grid item>
        <SelectToken />
      </Grid>
      <Grid
        container
        item
      >
        <Grid
          item
          span={12}
        >
          <Console />
        </Grid>
        <Grid
          container
          item
          span={12}
        >
          <Grid item>
            <StakingTokeBalances />
          </Grid>
          <Grid item>
            <SystemInfo />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
      </Grid>
      <Grid item>
        <StakingPool />
      </Grid>
      <Grid item>
        <Transaction />
      </Grid>
    </Grid>
  );
};
