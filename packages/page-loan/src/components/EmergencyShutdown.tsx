import React, { FC } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { Card, Grid } from '@acala-dapp/ui-components';
import { LockPrices } from './LockPrices';
import { EmergencyPrepeper } from './EmergencyPrepper';
import { EmergencyShutdownProvider } from './EmergencyShutdownProvider';
import { WithdrawNoDebitLoan } from './WithdrawNoDebitLoan';
import { RefundCollateral } from './RefundCollateral';

// import classes from './EmergencyShutdown.module.scss';

export const Inner = (): JSX.Element => {
  // const { step } = useContext(EmergencyShutdownContext);

  return (
    <Grid
      container
      direction='column'
    >
      <Grid item>
        <Card header={<p>Emergency Shutdown</p>}>
          <Stepper nonLinear
            orientation='vertical'>
            <Step active={true}>
              <StepLabel>Locked Collateral Prices</StepLabel>
              <StepContent>
                <LockPrices />
              </StepContent>
            </Step>
            <Step active={true}>
              <StepLabel>Process System Debit And Auction Process.</StepLabel>
              <StepContent>
                <EmergencyPrepeper />
              </StepContent>
            </Step>
            <Step active={true}>
              <StepLabel>Waiting For Open Refund Collateral.</StepLabel>
              <StepContent>
                <RefundCollateral />
              </StepContent>
            </Step>
          </Stepper>
        </Card>
      </Grid>
      <Grid item>
        <WithdrawNoDebitLoan />
      </Grid>
    </Grid>
  );
};

export const EmergencyShutdown: FC = () => {
  return (
    <EmergencyShutdownProvider>
      <Inner/>
    </EmergencyShutdownProvider>
  );
};
