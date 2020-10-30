import React, { FC, useMemo, useCallback, useState, useRef } from 'react';
import { noop } from 'lodash';

import { FixedPointNumber } from '@acala-network/sdk-core';
import { StakingPool } from '@acala-network/sdk-homa';
import { Card, Tabs, List } from '@acala-dapp/ui-components';
import { TxButton, TwoWayBalanceInput, FormatBalance, BalanceInputValue } from '@acala-dapp/react-components';
import { useConstants, useStakingPool, useBalance, useInputValue } from '@acala-dapp/react-hooks';

import classes from './ExpressConsole.module.scss';

const Price: FC = () => {
  const { liquidCurrency, stakingCurrency } = useConstants();
  const stakingPool = useStakingPool();

  const exchangeRate = useMemo((): FixedPointNumber => {
    if (!stakingPool) return FixedPointNumber.ZERO;

    return FixedPointNumber.ONE.div(stakingPool.stakingPool.liquidExchangeRate());
  }, [stakingPool]);

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
  const stakingPool = useStakingPool();
  const stakingCurrencyBalance = useBalance(stakingCurrency);

  const [inputValue, setInputValue, { reset }] = useInputValue({
    amount: 0,
    token: stakingCurrency
  });

  const twoWayValues = useMemo(() => {
    return [
      inputValue,
      {
        amount: stakingPool?.stakingPool.getLiquidAmountInMint(new FixedPointNumber(inputValue.amount)).toNumber() || 0,
        token: liquidCurrency
      }
    ] as [BalanceInputValue, BalanceInputValue];
  }, [stakingPool, inputValue, liquidCurrency]);

  const params = useMemo(() => {
    if (!stakingCurrencyBalance) return [];

    return [new FixedPointNumber(inputValue.amount).toChainData()];
  }, [inputValue, stakingCurrencyBalance]);

  const onSuccess = useCallback(() => {
    reset();
  }, [reset]);

  const onMax = useCallback(() => {
    setInputValue({
      amount: stakingCurrencyBalance.toNumber(),
      token: stakingCurrency
    });
  }, [setInputValue, stakingCurrency, stakingCurrencyBalance]);

  const isDisabled = useMemo(() => {
    return twoWayValues[0].amount === 0 || twoWayValues[1].amount === 0;
  }, [twoWayValues]);

  return (
    <div className={classes.panelContent}>
      <div className={classes.main}>
        <TwoWayBalanceInput
          className={classes.balanceInput}
          onChange={setInputValue}
          onMax={onMax}
          value={twoWayValues}
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
  const stakingPool = useStakingPool();
  const liquidCurrencyBalance = useBalance(liquidCurrency);
  const [unstakeResult, seteUnStakeResult] = useState<ReturnType<StakingPool['getStakingAmountInRedeemByFreeUnbonded']>>();

  const [inputValue, setInputValue, { reset }] = useInputValue({
    amount: 0,
    token: liquidCurrency
  });

  const [twoWayValue, setTwoWayValue] = useState<[BalanceInputValue, BalanceInputValue]>([
    inputValue,
    { amount: 0, token: stakingCurrency }
  ]);

  const onChange = useCallback((value: BalanceInputValue) => {
    if (!stakingPool) return;

    const unstakeResult = stakingPool.stakingPool.getStakingAmountInRedeemByFreeUnbonded(
      new FixedPointNumber(value.amount)
    );

    seteUnStakeResult(unstakeResult);
    setInputValue(value);
    setTwoWayValue([
      value,
      {
        amount: unstakeResult.received.toNumber(),
        token: liquidCurrency
      }
    ]);
  }, [stakingPool, setInputValue, seteUnStakeResult, setTwoWayValue, liquidCurrency]);

  const maxToUnstake = useMemo<FixedPointNumber>((): FixedPointNumber => {
    if (!stakingPool) return FixedPointNumber.ZERO;

    return FixedPointNumber.ONE;
  }, [stakingPool]);

  const params = useMemo(() => {
    if (!liquidCurrencyBalance) return [];

    return [new FixedPointNumber(inputValue.amount).toChainData(), 'Immediately'];
  }, [inputValue, liquidCurrencyBalance]);

  const isDisabled = useMemo<boolean>((): boolean => {
    return inputValue.amount === 0;
  }, [inputValue]);

  const onSuccess = useCallback(() => {
    reset();
    setTwoWayValue([
      {
        amount: 0,
        token: stakingCurrency
      },
      {
        amount: 0,
        token: liquidCurrency
      }
    ]);
  }, [reset, setTwoWayValue, stakingCurrency, liquidCurrency]);

  return (
    <div className={classes.panelContent}>
      <div className={classes.main}>
        <TwoWayBalanceInput
          className={classes.balanceInput}
          onChange={onChange}
          value={twoWayValue}
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
                balance={unstakeResult?.fee}
                currency={stakingCurrency}
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
