import React, { FC } from 'react';

import { AirDrop } from './AirDrop';
import { Grid, SubTitle } from '@acala-dapp/ui-components';

import { UserCard } from './UserCard';
import { TokenBalances } from './TokenBalances';
import { LPBalances } from './LPBalances';

export const AcalaConsole: FC = () => {
  return (
    <Grid container>
      <Grid item>
        <UserCard />
      </Grid>

      <Grid item>
        <TokenBalances />
      </Grid>

      <Grid item>
        <SubTitle>LP Tokens</SubTitle>
        <LPBalances />
      </Grid>

      <Grid item>
        <AirDrop />
      </Grid>
    </Grid>
  );
};
