import React, { FC, useCallback, useMemo } from 'react';

import { Card, InputField, SpaceBetweenBox, List } from '@acala-dapp/ui-components';
import { BalanceInput, TxButton, UserBalance, LPExchangeRate, LPSize, LPShare, BalanceInputValue, getCurrenciesFromDexShare, LPSizeWithShare } from '@acala-dapp/react-components';
import { useLPCurrencies, useApi, useAccounts, useBalance } from '@acala-dapp/react-hooks';
import { FixedPointNumber } from '@acala-network/sdk-core';

import classes from './Withdraw.module.scss';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';

export const WithdrawConsole: FC = () => {
  const { api } = useApi();
  const enabledCurrencies = useLPCurrencies();
  const lpCurrencies = useLPCurrencies();
  const [selectedLP, setSelectedLP, { reset: resetSelectLP }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: lpCurrencies[0]
  });
  const balance = useBalance(selectedLP.token);

  const handleMax = useCallback(() => {
    setSelectedLP({
      amount: balance.toNumber(),
      token: selectedLP.token
    });
  }, [balance, setSelectedLP, selectedLP]);

  const handleSuccess = useCallback((): void => {
    resetSelectLP();
  }, [resetSelectLP]);

  const params = useMemo(() => {
    if (!selectedLP.amount || !selectedLP.token) return [];

    const [token1, token2] = getCurrenciesFromDexShare(api, selectedLP.token);

    return [token1, token2, new FixedPointNumber(selectedLP.amount).toChainData()];
  }, [selectedLP, api]);

  return (
    <Card>
      <div className={classes.main}>
        <InputField
          actionRender={(): JSX.Element => {
            return (
              <TxButton
                disabled={false}
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
                  enableTokenSelect={true}
                  error={''}
                  onChange={setSelectedLP}
                  onMax={handleMax}
                  selectableTokens={enabledCurrencies}
                  showMaxBtn
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
