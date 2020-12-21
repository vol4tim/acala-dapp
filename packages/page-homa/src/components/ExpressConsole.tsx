import React, { FC, useMemo, useCallback, useState } from 'react';

import { FixedPointNumber } from '@acala-network/sdk-core';
import { StakingPool } from '@acala-network/sdk-homa';
import { Card, Tabs, List, useTabs, CardTabHeader } from '@acala-dapp/ui-components';
import { TxButton, TwoWayBalanceInput, FormatBalance, BalanceInputValue, UserBalance, eliminateGap } from '@acala-dapp/react-components';
import { useConstants, useStakingPool, useBalance, useInputValue, useBalanceValidator } from '@acala-dapp/react-hooks';

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

  const [inputValue, setInputValue, { error, reset, setValidator }] = useInputValue({
    amount: 0,
    token: stakingCurrency
  });

  const twoWayValues = useMemo(() => {
    return [
      inputValue,
      {
        amount: stakingPool?.stakingPool.getLiquidAmountInMint(new FixedPointNumber(inputValue.amount || 0)).toNumber() || 0,
        token: liquidCurrency
      }
    ] as [BalanceInputValue, BalanceInputValue];
  }, [stakingPool, inputValue, liquidCurrency]);

  const params = useCallback(() => {
    if (!stakingCurrencyBalance) return;

    return [
      eliminateGap(
        new FixedPointNumber(inputValue.amount || 0),
        stakingCurrencyBalance
      ).toChainData()
    ];
  }, [inputValue, stakingCurrencyBalance]);

  useBalanceValidator({
    currency: stakingCurrency,
    updateValidator: setValidator
  });

  const onSuccess = useCallback(() => {
    reset();
  }, [reset]);

  const handleMax = useCallback(() => {
    setInputValue({
      amount: stakingCurrencyBalance.toNumber(),
      token: stakingCurrency
    });
  }, [setInputValue, stakingCurrency, stakingCurrencyBalance]);

  const isDisabled = useMemo(() => {
    if (error) return true;

    if (twoWayValues[0].amount === 0 || twoWayValues[1].amount === 0) return true;

    return false;
  }, [twoWayValues, error]);

  return (
    <div className={classes.panelContent}>
      <div className={classes.main}>
        <TwoWayBalanceInput
          className={classes.balanceInput}
          error={error}
          onChange={setInputValue}
          onMax={handleMax}
          value={twoWayValues}
        />
        <List>
          <List.Item
            label='Max To Stake'
            value={<UserBalance currency={stakingCurrency} />}
          />
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
        onInblock={onSuccess}
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
  const [unstakeResult, setUnStakeResult] = useState<ReturnType<StakingPool['getStakingAmountInRedeemByFreeUnbonded']>>();

  const [inputValue, setInputValue, { error, reset, setValidator }] = useInputValue({
    amount: 0,
    token: liquidCurrency
  });

  const maxToUnstake = useMemo<FixedPointNumber>((): FixedPointNumber => {
    if (!stakingPool) return FixedPointNumber.ZERO;

    return FixedPointNumber.fromInner(stakingPool?.derive.freeUnbonded.toString()).min(liquidCurrencyBalance);
  }, [stakingPool, liquidCurrencyBalance]);

  useBalanceValidator({
    currency: inputValue.token,
    max: [maxToUnstake, ''],
    updateValidator: setValidator
  });

  const [twoWayValue, setTwoWayValue] = useState<[Partial<BalanceInputValue>, Partial<BalanceInputValue>]>([
    inputValue,
    { amount: 0, token: stakingCurrency }
  ]);

  const handleMax = useCallback(() => {
    if (!stakingPool) return;

    const unstakeResult = stakingPool.stakingPool.getStakingAmountInRedeemByFreeUnbonded(maxToUnstake);

    setUnStakeResult(unstakeResult);
    setInputValue({ amount: maxToUnstake.toNumber() });
    setTwoWayValue([
      { amount: maxToUnstake.toNumber(), token: inputValue.token },
      { amount: unstakeResult.received.toNumber(), token: stakingCurrency }
    ]);
  }, [stakingPool, setInputValue, setUnStakeResult, setTwoWayValue, stakingCurrency, maxToUnstake, inputValue]);

  const handleChange = useCallback((value: Partial<BalanceInputValue>) => {
    if (!stakingPool || !value.amount) return;

    const unstakeResult = stakingPool.stakingPool.getStakingAmountInRedeemByFreeUnbonded(
      new FixedPointNumber(value.amount)
    );

    if (unstakeResult.received.isZero()) {
      setUnStakeResult(undefined);

      return;
    }

    setUnStakeResult(unstakeResult);
    setInputValue(value);
    setTwoWayValue([
      value,
      { amount: unstakeResult.received.toNumber(), token: stakingCurrency }
    ]);
  }, [stakingPool, setInputValue, setUnStakeResult, setTwoWayValue, stakingCurrency]);

  const params = useCallback(() => {
    if (!liquidCurrencyBalance || !inputValue.amount) return;

    return [
      eliminateGap(
        new FixedPointNumber(inputValue.amount),
        maxToUnstake,
        new FixedPointNumber('0.000001')
      ).toChainData(),
      'Immediately'
    ];
  }, [inputValue, liquidCurrencyBalance, maxToUnstake]);

  const isDisabled = useMemo<boolean>((): boolean => {
    if (error) return true;

    if (inputValue.amount === 0) return true;

    return false;
  }, [inputValue, error]);

  const onSuccess = useCallback(() => {
    reset();
    setTwoWayValue([
      { amount: 0, token: liquidCurrency },
      { amount: 0, token: stakingCurrency }
    ]);
    setUnStakeResult(undefined);
  }, [reset, setTwoWayValue, stakingCurrency, liquidCurrency, setUnStakeResult]);

  return (
    <div className={classes.panelContent}>
      <div className={classes.main}>
        <TwoWayBalanceInput
          className={classes.balanceInput}
          error={error}
          onChange={handleChange}
          onMax={handleMax}
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
          {
            unstakeResult ? (
              <List.Item
                label='Fee'
                value={
                  <FormatBalance
                    balance={unstakeResult?.fee}
                    currency={stakingCurrency}
                  />
                }
              />
            ) : null
          }
          {
            unstakeResult ? (
              <List.Item
                label='Received'
                value={
                  <FormatBalance
                    balance={unstakeResult?.received}
                    currency={stakingCurrency}
                  />
                }
              />
            ) : null
          }
        </List>
      </div>
      <TxButton
        className={classes.actionBtn}
        disabled={isDisabled}
        method='redeem'
        onInblock={onSuccess}
        params={params}
        section='homa'
        size='large'
      >
        Unstake
      </TxButton>
    </div>
  );
};

type ExpressConsoleTabTypes = 'stake' | 'unstake';

export const ExpressConsole: FC = () => {
  const { changeTabs, currentTab } = useTabs<ExpressConsoleTabTypes>('stake');

  return (
    <Card
      padding={false}
    >
      <Tabs
        active={currentTab}
        divider={false}
        onChange={changeTabs}
      >
        <Tabs.Panel
          $key='stake'
          header={
            <CardTabHeader
              active={currentTab === 'stake'}
              key='tab-stake'
              onClick={(): void => changeTabs('stake')}
            >
              Stake
            </CardTabHeader>
          }
          key='tab-stake'
        >
          <StakePanel />
        </Tabs.Panel>
        <Tabs.Panel
          $key='unstake'
          header={
            <CardTabHeader
              active={currentTab === 'unstake'}
              key='tab-unstake'
              onClick={(): void => changeTabs('unstake')}
            >
              Unstake
            </CardTabHeader>
          }
          key='tab-unstake'
        >
          <UnstakePanel />
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};
