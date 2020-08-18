import React, { FC, useContext } from 'react';
import { Card, Grid, Condition, Fadein } from '@acala-dapp/ui-components';
import { Steps } from 'antd';

import { LockPrices } from './LockPrices';
import { EmergencyShutdownProvider, EmergencyShutdownContext, StepRoute } from './EmergencyShutdownProvider';
import { WithdrawNoDebitLoan } from './WithdrawNoDebitLoan';
import { ReclaimCollateral } from './ReClaimCollaterals';
import { Tips } from './Tips';
import { Controller } from './Controller';
import { Process } from './Process';
import { Success } from './Success';

export const Inner = (): JSX.Element => {
  const { reclaimBalanceIsEmpty, step } = useContext(EmergencyShutdownContext);

  return (
    <Card>
      <Condition condition={step !== 'success' && !reclaimBalanceIsEmpty }>
        <Steps
          current={StepRoute.findIndex((c) => step === c)}
          size='small'
        >
          <Steps.Step title='Shutdown Triggered' />
          <Steps.Step title='In Liquidation' />
          <Steps.Step title='Reclaim' />
        </Steps>
      </Condition>
      <Condition condition={step !== 'success'}>
        <Tips />
      </Condition>
      <Grid container>
        <Condition condition={step === 'trigger'}>
          <Grid item>
            <Fadein>
              <LockPrices />
            </Fadein>
          </Grid>
          <Grid item>
            <Fadein>
              <WithdrawNoDebitLoan />
            </Fadein>
          </Grid>
        </Condition>
        <Condition condition={step === 'process'}>
          <Grid item>
            <Fadein>
              <Process />
            </Fadein>
          </Grid>
        </Condition>
        <Condition condition={step === 'reclaim'}>
          <Grid item>
            <Fadein>
              <ReclaimCollateral />
            </Fadein>
          </Grid>
        </Condition>
        <Condition condition={step === 'success'}>
          <Grid item>
            <Fadein>
              <Success />
            </Fadein>
          </Grid>
        </Condition>
        <Grid item>
          <Controller />
        </Grid>
      </Grid>
    </Card>
  );
};

export const EmergencyShutdown: FC = () => {
  return (
    <EmergencyShutdownProvider>
      <Inner/>
    </EmergencyShutdownProvider>
  );
};
