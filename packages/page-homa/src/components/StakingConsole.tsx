import React, { FC, useContext, useCallback, ReactNode } from 'react';
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

  if (!stakingPoolHelper || !stakingPool) {
    return null;
  }

  const estimated = {
    depositStakingToken: Fixed18.fromNatural(form.values.stakingBalance).mul(convertToFixed18(rewardRate || 0)),
    receivedLiquidToken: stakingPoolHelper.convertToLiquid(Fixed18.fromNatural(form.values.stakingBalance))
  };

  const listConfig = [
    {
      key: 'receivedLiquidToken',
      /* eslint-disable-next-line react/display-name */
      render: (value: Fixed18): ReactNode => (
        value.isFinity() ? (<FormatBalance
          balance={value}
          currency={stakingPool.liquidCurrency}
        />) : '~'
      ),
      title: 'Mint'
    },
    {
      key: 'depositStakingToken',
      /* eslint-disable-next-line react/display-name */
      render: (value: Fixed18): ReactNode => (
        value.isFinity() ? (<FormatBalance
          balance={value}
          currency={stakingPool.stakingCurrency}
        />) : '~'
      ),
      title: 'Estimated Profit / Era'
    }
  ];

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
      direction='column'
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
          onChange={form.handleChange}
          onMax={handleMax}
          showMaxBtn
          token={stakingPool.stakingCurrency}
          value={form.values.stakingBalance}
        />
      </Grid>
      <Grid item>
        <TxButton
          className={classes.txBtn}
          disabled={checkDisabled()}
          method='mint'
          onSuccess={resetForm}
          params={[numToFixed18Inner(form.values.stakingBalance)]}
          section='homa'
          size='middle'
        >
          Deposit
        </TxButton>
      </Grid>
      <Grid item>
        <List
          config={listConfig}
          data={estimated}
          itemClassName={classes.listItem}
        />
      </Grid>
    </Grid>
  );
};
