import React, { FC, useContext, useCallback, useMemo } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { Grid, List } from '@acala-dapp/ui-components';
import { TxButton, BalanceInput, numToFixed18Inner, FormatBalance } from '@acala-dapp/react-components';
import { useFormValidator, useBalance } from '@acala-dapp/react-hooks';

import classes from './StakingConsole.module.scss';
import { StakingPoolContext } from './StakingPoolProvider';

export const StakingConsole: FC = () => {
  const { rewardRate, stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);
  const balance = useBalance(stakingPool ? stakingPool.stakingCurrency : '');

  const validator = useFormValidator({
    stakingBalance: {
      currency: stakingPool && stakingPool.stakingCurrency,
      type: 'balance'
    }
  });

  const form = useFormik({
    initialValues: {
      stakingBalance: (('' as any) as number)
    },
    onSubmit: noop,
    validate: validator
  });

  const resetForm = useCallback(() => {
    form.resetForm();
  }, [form]);

  const receivedLiquidToken = useMemo<Fixed18>((): Fixed18 => {
    if (!stakingPoolHelper || !form.values.stakingBalance) return Fixed18.ZERO;

    return stakingPoolHelper.convertToLiquid(Fixed18.fromNatural(form.values.stakingBalance));
  }, [stakingPoolHelper, form.values.stakingBalance]);

  const handleStakingBalanceChange = useCallback((value: number): void => {
    form.setFieldValue('stakingBalance', value);
  }, [form]);

  const profit = useMemo<Fixed18>((): Fixed18 => {
    if (!rewardRate || !form.values.stakingBalance) return Fixed18.ZERO;

    return Fixed18.fromNatural(form.values.stakingBalance).mul(convertToFixed18(rewardRate || 0));
  }, [rewardRate, form.values.stakingBalance]);

  if (!stakingPoolHelper || !stakingPool) {
    return null;
  }

  const checkDisabled = (): boolean => {
    if (!form.values.stakingBalance) {
      return true;
    }

    if (form.errors.stakingBalance) {
      return true;
    }

    return false;
  };

  const handleMax = (): void => {
    form.setFieldValue('stakingBalance', convertToFixed18(balance || 0).toNumber());
  };

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
          error={form.errors.stakingBalance}
          id='stakingBalance'
          name='stakingBalance'
          onChange={handleStakingBalanceChange}
          onMax={handleMax}
          showMaxBtn
          token={stakingPool.stakingCurrency}
          value={form.values.stakingBalance}
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
            disabled={checkDisabled()}
            method='mint'
            onExtrinsicSuccess={resetForm}
            params={[numToFixed18Inner(form.values.stakingBalance)]}
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
