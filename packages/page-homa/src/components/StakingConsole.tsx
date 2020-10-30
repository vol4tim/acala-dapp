import React, { FC, useContext, useCallback, useMemo } from 'react';

import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { Grid, List } from '@acala-dapp/ui-components';
import { TxButton, BalanceInput, FormatBalance, BalanceInputValue } from '@acala-dapp/react-components';
import { useBalance, useInputValue, useConstants, useStakingRewardAPR, useStakingPool } from '@acala-dapp/react-hooks';

import classes from './StakingConsole.module.scss';

export const StakingConsole: FC = () => {
  const { stakingCurrency, liquidCurrency } = useConstants();
  const stakingPool = useStakingPool();
  const rewardRate = useStakingRewardAPR();
  const balance = useBalance(stakingCurrency);

  const [stakingValue, setStakingValue, { ref, reset }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: stakingCurrency
  });

  const resetForm = useCallback(() => {
    reset();
  }, [reset]);

  const params = useMemo(() => {
    return [new FixedPointNumber(stakingValue.amount).toChainData()];
  }, [stakingValue]);

  const receivedAmount = useMemo<FixedPointNumber>((): FixedPointNumber => {
    if (!stakingPool || !stakingValue.amount) return FixedPointNumber.ZERO;

    return stakingPool.stakingPool.getLiquidAmountInMint(new FixedPointNumber(stakingValue.amount));
  }, [stakingPool, stakingValue]);

  const profit = useMemo<FixedPointNumber>((): FixedPointNumber => {
    if (!rewardRate || !stakingValue.amount) return FixedPointNumber.ZERO;

    return new FixedPointNumber(stakingValue.amount).times(rewardRate);
  }, [rewardRate, stakingValue]);

  const isDisable = useMemo(() => {
    return stakingValue.amount === 0;
  }, [stakingValue]);

  const handleMax = useCallback((): void => {
    setStakingValue({
      amount: balance.toNumber(),
      token: ref.current.token
    });
  }, [setStakingValue, ref, balance]);

  if (!stakingPool) {
    return null;
  }

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
          onChange={setStakingValue}
          onMax={handleMax}
          showMaxBtn
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
            onExtrinsicSuccess={resetForm}
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
