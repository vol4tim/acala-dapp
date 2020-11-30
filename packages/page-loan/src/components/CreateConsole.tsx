import React, { FC, useContext, useMemo } from 'react';

import { Card, Step, Condition, Row, Col, SubTitle } from '@acala-dapp/ui-components';
import { useConstants } from '@acala-dapp/react-hooks';
import { TokenName, getTokenName } from '@acala-dapp/react-components';

import { SelectCollateral } from './SelectCollateral';
import classes from './CreateConsole.module.scss';
import { Generate } from './Generate';
import { CreateProvider, createProviderContext } from './CreateProvider';
import { Confirm } from './Confirm';
import { Success } from './Success';
import { CreateOverview } from './CreateOverview';

const stepConfig = [
  {
    index: 'select',
    text: 'Select Collateral'
  },
  {
    index: 'generate',
    text: 'Generate aUSD'
  },
  {
    index: 'confirm',
    text: 'Confirmation'
  }
];

const Main: FC = () => {
  const { selectedToken, step } = useContext(createProviderContext);
  const { stableCurrency } = useConstants();

  const tips = useMemo((): string => {
    if (step === 'select') {
      return 'Each collateral type has its own unique risk profiles.';
    }

    if (step === 'generate') {
      return `Deposit ${getTokenName(selectedToken.asToken.toString())} as collateral to genearte ${getTokenName(stableCurrency.asToken.toString())}`;
    }

    if (step === 'confirm') {
      return `Confirm creating a collateralized loan for ${getTokenName(stableCurrency.asToken.toString())}`;
    }

    return '';
  }, [selectedToken, stableCurrency, step]);

  return (
    <Card className={classes.root}
      overflowHidden
      padding={false}>
      <Condition condition={step !== 'success'}>
        <Step
          config={stepConfig}
          current={step}
        />
        <p className={classes.tips}>{tips}</p>
      </Condition>
      <Condition condition={step === 'select'}>
        <SelectCollateral />
      </Condition>
      <Condition condition={step === 'generate'}>
        <Generate />
      </Condition>
      <Condition condition={step === 'confirm'}>
        <Confirm />
      </Condition>
      <Condition condition={step === 'success'}>
        <Success />
      </Condition>
    </Card>
  );
};

const Inner: FC = () => {
  const { selectedToken, step } = useContext(createProviderContext);

  return (
    <Row gutter={[24, 24]}>
      <Condition condition={step !== 'select'}>
        <Col span={24}>
          <SubTitle>
            <span style={{ marginRight: 8 }}>Collateration</span>
            <TokenName currency={selectedToken} />
          </SubTitle>
        </Col>
      </Condition>
      <Col span={24}>
        <Row gutter={24}>
          <Col
            span={new Set(['select', 'success']).has(step) ? 24 : 12}>
            <Main />
          </Col>
          <Condition condition={step !== 'select' && step !== 'success' }>
            <Col span={12}>
              <CreateOverview />
            </Col>
          </Condition>
        </Row>
      </Col>
    </Row>
  );
};

export const CreateConsole: FC = () => (
  <CreateProvider>
    <Inner />
  </CreateProvider>
);
