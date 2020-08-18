import React, { FC } from 'react';

import { AirDrop } from '@acala-dapp/react-components';
import { Grid } from '@acala-dapp/ui-components';

import { UserCard } from './UserCard';
import { Transaction } from './Transaction';
import { WalletBalance } from './WalletBalance';

export const AcalaConsole: FC = () => {
  return (
    <Grid container>
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
  );
};
