import React, { FC, useCallback, useMemo } from 'react';

import { styled, Card, InputField, FlexBox, List, Row, Col } from '@acala-dapp/ui-components';
import { BalanceInput, UserBalance, LPExchangeRate, LPSize, LPShare, BalanceInputValue, getCurrenciesFromDexShare, LPSizeWithShare, eliminateGap } from '@acala-dapp/react-components';
import { useLPCurrencies, useApi, useBalance, useBalanceValidator } from '@acala-dapp/react-hooks';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';
import { LiquidityInformation } from './LiquidityInformation';
import TxButton from './TxButton';

const CLPSizeWithShare = styled(LPSizeWithShare)`
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 100%;
  width: 100%;
  border: 1px solid #e9e9e9;
  font-size: 20px;
  line-height: 29px;
`;

export const WithdrawConsole: FC = () => {
  const { api } = useApi();
  const enabledCurrencies = useLPCurrencies();
  const lpCurrencies = useLPCurrencies();
  const [selectedLP, setSelectedLP, { error, setValidator }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: lpCurrencies[0]
  });
  const balance = useBalance(selectedLP.token);

  useBalanceValidator({
    currency: selectedLP.token,
    updateValidator: setValidator
  });

  const clearAmount = useCallback(() => {
    setSelectedLP({
      amount: 0,
      token: selectedLP.token
    });
  }, [setSelectedLP, selectedLP]);

  const handleMax = useCallback(() => {
    setSelectedLP({
      amount: balance.toNumber(),
      token: selectedLP.token
    });
  }, [balance, setSelectedLP, selectedLP]);

  const handleSuccess = useCallback((): void => clearAmount(), [clearAmount]);

  const params = useCallback(() => {
    if (!selectedLP.amount || !selectedLP.token) return [];

    const [token1, token2] = getCurrenciesFromDexShare(api, selectedLP.token);

    return [
      token1,
      token2,
      eliminateGap(
        new FixedPointNumber(selectedLP.amount),
        balance,
        new FixedPointNumber('0.000001')
      ).toChainData()
    ];
  }, [selectedLP, api, balance]);

  const isDisabled = useMemo(() => {
    if (!selectedLP.amount) return true;

    if (error) return true;

    return false;
  }, [selectedLP, error]);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <LiquidityInformation />
      </Col>
      <Col span={24}>
        <Card>
          <InputField
            leftAddition={(): JSX.Element => {
              return (
                <List>
                  <List.Item
                    label='Exchange Rate'
                    value={<LPExchangeRate lp={selectedLP.token} />}
                  />
                  <List.Item
                    label='Current Pool Size'
                    value={<LPSize lp={selectedLP.token} />}
                  />
                </List>
              );
            }}
            leftRender={(): JSX.Element => {
              return (
                <div>
                  <BalanceInput
                    disabled={balance.isZero()}
                    enableTokenSelect={true}
                    error={error}
                    onChange={setSelectedLP}
                    onMax={handleMax}
                    selectableTokens={enabledCurrencies}
                    value={selectedLP}
                  />
                </div>
              );
            }}
            leftTitle={(): JSX.Element => {
              return (
                <FlexBox justifyContent='space-between'>
                  <p>Input: LP Share</p>
                  <UserBalance token={selectedLP.token} />
                </FlexBox>
              );
            }}
            rightAddition={(): JSX.Element => {
              return (
                <List>
                  <List.Item
                    label='Your Pool Share(%)'
                    value={
                      <LPShare
                        lp={selectedLP.token}
                        showRatio
                      />
                    }
                  />
                </List>
              );
            }}
            rightRender={(): JSX.Element => {
              return (
                <CLPSizeWithShare
                  lp={selectedLP.token}
                  share={selectedLP.amount}
                />
              );
            }}
            rightTitle={(): string => 'Output: Liquidity'}
            separation={'right-arrow'}
          />
        </Card>
      </Col>
      <Col span={24}>
        <TxButton
          disabled={isDisabled}
          method='removeLiquidity'
          onInblock={handleSuccess}
          params={params}
          section='dex'
          size='large'
        >
          Withdraw Liquidity
        </TxButton>
      </Col>
    </Row>
  );
};
