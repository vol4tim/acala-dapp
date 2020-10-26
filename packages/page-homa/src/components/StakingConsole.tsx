import React, { FC, useContext, useCallback, useMemo } from 'react';

import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { Grid, List } from '@acala-dapp/ui-components';
import { TxButton, BalanceInput, FormatBalance, BalanceInputValue } from '@acala-dapp/react-components';
import { useBalance, useInputValue, useConstants } from '@acala-dapp/react-hooks';

import classes from './StakingConsole.module.scss';
import { StakingPoolContext } from './StakingPoolProvider';

export const StakingConsole: FC = () => {
  const { stakingCurrency } = useConstants();
  const { rewardRate, stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);
  const balance = useBalance(stakingPool ? stakingPool.stakingCurrency : '');

  const [stakingValue, setStakingValue, { ref, reset }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: stakingPool ? stakingPool.stakingCurrency : stakingCurrency
  }, {
    max: (value: BalanceInputValue) => {
      value.amount = value.amount > balance.toNumber() ? balance.toNumber() : value.amount;

      return value;
    },
    min: (value: BalanceInputValue) => {
      value.amount = value.amount < 0 ? 0 : value.amount;

      return value;
    }
  });

  const resetForm = useCallback(() => {
    reset();
  }, [reset]);

  const params = useMemo(() => {
    return [new FixedPointNumber(stakingValue.amount).toChainData()];
  }, [stakingValue]);

  const receivedLiquidToken = useMemo<Fixed18>((): Fixed18 => {
    if (!stakingPoolHelper || !stakingValue.amount) return Fixed18.ZERO;

    return stakingPoolHelper.convertToLiquid(Fixed18.fromNatural(stakingValue.amount));
  }, [stakingPoolHelper, stakingValue]);

  const profit = useMemo<Fixed18>((): Fixed18 => {
    if (!rewardRate || !stakingValue.amount) return Fixed18.ZERO;

    return Fixed18.fromNatural(stakingValue.amount).mul(convertToFixed18(rewardRate || 0));
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

  if (!stakingPoolHelper || !stakingPool) {
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
                balance={receivedLiquidToken}
                currency={stakingPool.liquidCurrency}
              />
            }
          />
          <List.Item
            label='Estimated Profit / Era'
            value={
              <FormatBalance
                balance={profit}
                currency={stakingPool.stakingCurrency}
              />
            }
          />
        </List>
      </Grid>
    </Grid>
  );
};
