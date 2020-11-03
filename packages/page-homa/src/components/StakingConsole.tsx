import React, { FC, useCallback, useMemo } from 'react';

import { FixedPointNumber } from '@acala-network/sdk-core';
import { Grid, List } from '@acala-dapp/ui-components';
import { TxButton, BalanceInput, FormatBalance, BalanceInputValue, eliminateGap } from '@acala-dapp/react-components';
import { useBalance, useInputValue, useConstants, useStakingRewardAPR, useStakingPool, useBalanceValidator } from '@acala-dapp/react-hooks';

import classes from './StakingConsole.module.scss';
import { StakingTokeBalances } from './StakingTokenBalances';

export const StakingConsole: FC = () => {
  const { liquidCurrency, stakingCurrency } = useConstants();
  const stakingPool = useStakingPool();
  const rewardRate = useStakingRewardAPR();
  const balance = useBalance(stakingCurrency);

  const [stakingValue, setStakingValue, { error, ref, reset, setValidator }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: stakingCurrency
  });

  useBalanceValidator({
    currency: stakingCurrency,
    updateValidator: setValidator
  });

  const resetForm = useCallback(() => {
    reset();
  }, [reset]);

  const params = useMemo(() => {
    return [
      eliminateGap(
        new FixedPointNumber(stakingValue.amount),
        balance,
        new FixedPointNumber('0.0000001')
      ).toChainData()
    ];
  }, [stakingValue, balance]);

  const receivedAmount = useMemo<FixedPointNumber>((): FixedPointNumber => {
    if (!stakingPool || !stakingValue.amount) return FixedPointNumber.ZERO;

    return stakingPool.stakingPool.getLiquidAmountInMint(new FixedPointNumber(stakingValue.amount));
  }, [stakingPool, stakingValue]);

  const profit = useMemo<FixedPointNumber>((): FixedPointNumber => {
    if (!rewardRate || !stakingValue.amount) return FixedPointNumber.ZERO;

    return new FixedPointNumber(stakingValue.amount).times(rewardRate);
  }, [rewardRate, stakingValue]);

  const isDisable = useMemo(() => {
    if (error) return true;

    if (stakingValue.amount === 0) return true;

    return false;
  }, [stakingValue, error]);

  const handleMax = useCallback((): void => {
    setStakingValue({
      amount: balance.toNumber(),
      token: ref.current.token
    });
  }, [setStakingValue, ref, balance]);

  if (!stakingPool) return null;

  return (
    <Grid
      className={classes.root}
      container
    >
      <Grid item>
        <p className={classes.notice}>
          Deposit DOT & Mint Liquid DOT (L-DOT). Your DOTs will be staked to earn returns, meanwhile you can use, trade and invest L-DOT balance in your wallet.
        </p>
      </Grid>
      <Grid item>
        <BalanceInput
          error={error}
          onChange={setStakingValue}
          onMax={handleMax}
          value={stakingValue}
        />
      </Grid>
      <Grid
        container
        item
        justity='center'
      >
        <Grid item>
          <TxButton
            className={classes.txBtn}
            disabled={isDisable}
            method='mint'
            onInblock={resetForm}
            params={params}
            section='homa'
            size='middle'
          >
            Deposit
          </TxButton>
        </Grid>
      </Grid>
      <Grid item>
        <List>
          <List.Item
            label='Mint'
            value={
              <FormatBalance
                balance={receivedAmount}
                currency={liquidCurrency}
              />
            }
          />
          <List.Item
            label='Estimated Profit / Era'
            value={
              <FormatBalance
                balance={profit}
                currency={stakingCurrency}
              />
            }
          />
        </List>
      </Grid>
    </Grid>
  );
};
