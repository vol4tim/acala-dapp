import React, { FC, useCallback, useMemo } from 'react';

import { Card, InputField, SpaceBetweenBox, List } from '@acala-dapp/ui-components';
import { BalanceInput, TxButton, UserBalance, LPExchangeRate, LPSize, LPShare, BalanceInputValue, getCurrenciesFromDexShare, LPSizeWithShare, eliminateGap } from '@acala-dapp/react-components';
import { useLPCurrencies, useApi, useBalance, useBalanceValidator } from '@acala-dapp/react-hooks';
import { FixedPointNumber } from '@acala-network/sdk-core';

import classes from './Withdraw.module.scss';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';

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
        new FixedPointNumber('0.0000001')
      ).toChainData()
    ];
  }, [selectedLP, api, balance]);

  const isDisabled = useMemo(() => {
    if (!selectedLP.amount) return true;

    if (error) return true;

    return false;
  }, [selectedLP, error]);

  return (
    <Card>
      <div className={classes.main}>
        <InputField
          actionRender={(): JSX.Element => {
            return (
              <TxButton
                disabled={isDisabled}
                method='removeLiquidity'
                onExtrinsicSuccess={handleSuccess}
                params={params}
                section='dex'
                size='large'
              >
                Withdraw
              </TxButton>
            );
          }}
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
              <SpaceBetweenBox>
                <p>Input: LP Share</p>
                <UserBalance token={selectedLP.token} />
              </SpaceBetweenBox>
            );
          }}
          rightContentClassName={classes.outputRoot}
          rightRender={(): JSX.Element => {
            return (
              <LPSizeWithShare
                className={classes.output}
                lp={selectedLP.token}
                share={selectedLP.amount}
              />
            );
          }}
          rightTitle={(): string => 'Output: Liquidity'}
          separation={'right-arrow'}
        />
      </div>
    </Card>
  );
};
