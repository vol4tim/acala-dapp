import React, { FC, useContext } from 'react';

import { Alert, Grid } from '@acala-dapp/ui-components';

import { LoanContext } from './LoanProvider';

export const LoanAlert: FC = () => {
  const { isShutdown } = useContext(LoanContext);

  // emergency shutdown message is the most important
  if (isShutdown) {
    return (
      <Grid item>
        <Alert
          message='Emergency Shutdown is Triggered'
          type='warning'
        />
      </Grid>
    );
  }

  return null;
};
