import React, { FC, useContext, useMemo } from 'react';

import { Card, Step, Condition, Row, Col, SubTitle, styled } from '@acala-dapp/ui-components';
import { useConstants } from '@acala-dapp/react-hooks';
import { getTokenName } from '@acala-dapp/react-components';

import { SelectCollateral } from './SelectCollateral';
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

const CreateConsoleRoot = styled(Card)`
  padding: 30px 0 24px 0;
  height: auto;
  overflow: hidden;
`;

const Tips = styled.p`
  margin: 24px 0 0 0;
  padding: 0 24px 12px 24px;
  font-size: 12px;
  line-height: 14px;
  color: var(--text-color-second);
  border-bottom: 1px solid #ebeef5;
`;

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
    <CreateConsoleRoot padding={false}>
      <Condition condition={step !== 'success'}>
        <Step
          config={stepConfig}
          current={step}
        />
        <Tips>{tips}</Tips>
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
    </CreateConsoleRoot>
  );
};

const Inner: FC = () => {
  const { selectedToken, step } = useContext(createProviderContext);

  return (
    <>
      <Condition condition={step !== 'select'}>
        <SubTitle>
          {`Collateral ${getTokenName(selectedToken)}`}
        </SubTitle>
      </Condition>
      <Row gutter={[24, 24]}>
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
    </>
  );
};

export const CreateConsole: FC = () => (
  <CreateProvider>
    <Inner />
  </CreateProvider>
);
