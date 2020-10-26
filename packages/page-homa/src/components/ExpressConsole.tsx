import React, { FC, useMemo, useCallback, useState, useRef } from 'react';
import { noop } from 'lodash';

import { Fixed18 } from '@acala-network/app-util';
import { Card, Tabs, List } from '@acala-dapp/ui-components';
import { TxButton, TwoWayBalanceInput, FormatBalance, eliminateGap, focusToFixed18 } from '@acala-dapp/react-components';
import { useConstants, useStakingPoolHelper, useBalance } from '@acala-dapp/react-hooks';

import classes from './ExpressConsole.module.scss';

const Price: FC = () => {
  const { liquidCurrency, stakingCurrency } = useConstants();
  const helper = useStakingPoolHelper();

  const exchangeRate = useMemo<Fixed18>((): Fixed18 => {
    if (!helper) return Fixed18.ZERO;

    return Fixed18.fromNatural(1).div(helper.liquidExchangeRate);
  }, [helper]);

  return (
    <FormatBalance
      pair={[
        {
          balance: 1,
          currency: stakingCurrency
        },
        {
          balance: exchangeRate,
          currency: liquidCurrency
        }
      ]}
      pairSymbol='≈'
    />
  );
};

const StakePanel: FC = () => {
  const { liquidCurrency, stakingCurrency } = useConstants();
  const helper = useStakingPoolHelper();
  const [amount, setAmount] = useState<number>(0);
  const resetForm = useRef<() => void>(noop);
  const [error, setError] = useState<boolean>(false);
  const stakingCurrencyBalance = useBalance(stakingCurrency);

  const exchangeRate = useMemo<Fixed18>((): Fixed18 => {
    if (!helper) return Fixed18.ZERO;

    return Fixed18.fromNatural(1).div(helper.liquidExchangeRate);
  }, [helper]);

  const params = useMemo(() => {
    if (!stakingCurrencyBalance) return [];

    const _amount = eliminateGap(Fixed18.fromNatural(amount), focusToFixed18(stakingCurrencyBalance), Fixed18.fromNatural(0.000001));

    return [_amount.innerToString()];
  }, [amount, stakingCurrencyBalance]);

  const isDisabled = useMemo<boolean>((): boolean => {
    if (!amount) return true;

    return error;
  }, [error, amount]);

  const onSuccess = useCallback(() => {
    setAmount(0);
    resetForm.current();
  }, [setAmount]);

  return (
    <div className={classes.panelContent}>
      <div className={classes.main}>
        <TwoWayBalanceInput
          className={classes.balanceInput}
          exchangeRate={exchangeRate}
          exposeReset={(reset: () => void): void => { resetForm.current = reset; }}
          initCurrencies={[stakingCurrency, liquidCurrency]}
          onChange={setAmount}
          onError={setError}
          swap={false}
        />
        <List>
          <List.Item
            label='Price'
            value={<Price />}
          />
        </List>
      </div>
      <TxButton
        className={classes.actionBtn}
        disabled={isDisabled}
        method='mint'
        onExtrinsicSuccess={onSuccess}
        params={params}
        section='homa'
        size='large'
      >
        Stake
      </TxButton>
    </div>
  );
};

const UnstakePanel: FC = () => {
  const { liquidCurrency, stakingCurrency } = useConstants();
  const helper = useStakingPoolHelper();
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const resetForm = useRef<() => void>(noop);
  const liquidCurrencyBalance = useBalance(liquidCurrency);

  const exchangeRate = useMemo<Fixed18>((): Fixed18 => {
    if (!helper) return Fixed18.ZERO;

    return helper.liquidExchangeRate;
  }, [helper]);

  const maxToUnstake = useMemo<Fixed18>((): Fixed18 => {
    if (!helper) return Fixed18.ZERO;

    return helper.communalFree.div(helper.liquidExchangeRate);
  }, [helper]);

  const params = useMemo(() => {
    if (!liquidCurrencyBalance) return [];

    const _amount = eliminateGap(Fixed18.fromNatural(amount), focusToFixed18(liquidCurrencyBalance), Fixed18.fromNatural(0.000001));

    return [_amount.innerToString(), 'Immediately'];
  }, [amount, liquidCurrencyBalance]);

  const isDisabled = useMemo<boolean>((): boolean => {
    if (!amount) return true;

    return error;
  }, [error, amount]);

  const onSuccess = useCallback(() => {
    setAmount(0);
    resetForm.current();
  }, [setAmount]);

  const fee = useMemo<Fixed18>((): Fixed18 => {
    if (!helper || !amount) return Fixed18.ZERO;

    return helper.claimFee(Fixed18.fromNatural(amount), helper.currentEra);
  }, [helper, amount]);

  return (
    <div className={classes.panelContent}>
      <div className={classes.main}>
        <TwoWayBalanceInput
          className={classes.balanceInput}
          exchangeRate={exchangeRate}
          exposeReset={(reset: () => void): void => { resetForm.current = reset; }}
          initCurrencies={[liquidCurrency, stakingCurrency]}
          max={maxToUnstake.toNumber(6, 3)}
          onChange={setAmount}
          onError={setError}
        />
        <List>
          <List.Item
            label='Max To Unstake'
            value={
              <FormatBalance
                balance={maxToUnstake}
                currency={liquidCurrency}
              />
            }
          />
          <List.Item
            label='Price'
            value={<Price />}
          />
          <List.Item
            label='Fee'
            value={
              <FormatBalance
                balance={fee}
                currency={liquidCurrency}
              />
            }
          />
        </List>
      </div>
      <TxButton
        className={classes.actionBtn}
        disabled={isDisabled}
        method='redeem'
        onExtrinsicSuccess={onSuccess}
        params={params}
        section='homa'
        size='large'
      >
        Unstake
      </TxButton>
    </div>
  );
};

export const ExpressConsole: FC = () => {
  return (
    <Card
      padding={false}
    >
      <Tabs type='card'>
        <Tabs.Panel
          key='stake'
          tab='Stake'
        >
          <StakePanel />
        </Tabs.Panel>
        <Tabs.Panel
          key='unstake'
          tab='Unstake'
        >
          <UnstakePanel />
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};
