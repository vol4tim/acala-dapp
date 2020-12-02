import React, { FC, useContext } from 'react';
import { Card, Row, Col, Condition } from '@acala-dapp/ui-components';
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
      <Row gutter={[24, 24]}>
        <Condition condition={step === 'trigger'}>
          <Col span={24}>
            <LockPrices />
          </Col>
          <Col span={24}>
            <WithdrawNoDebitLoan />
          </Col>
        </Condition>
        <Condition condition={step === 'process'}>
          <Col span={24}>
            <Process />
          </Col>
        </Condition>
        <Condition condition={step === 'reclaim'}>
          <Col span={24}>
            <ReclaimCollateral />
          </Col>
        </Condition>
        <Condition condition={step === 'success'}>
          <Col span={24}>
            <Success />
          </Col>
        </Condition>
        <Col span={24}>
          <Controller />
        </Col>
      </Row>
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
