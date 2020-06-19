import React, { FC, useContext, useState, useMemo, ReactNode } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { Fixed18 } from '@acala-network/app-util';
import { Grid, List, Radio } from '@acala-dapp/ui-components';
import { TxButton, BalanceInput, numToFixed18Inner, formatDuration, FormatBalance } from '@acala-dapp/react-components';
import { useFormValidator } from '@acala-dapp/react-hooks';

import classes from './RedeemConsole.module.scss';
import { TargetRedeemList } from './TargetRedeemList';
import { StakingPoolContext } from './StakingPoolProvider';

type RedeemType = 'Immediately' | 'Target' | 'WaitForUnbonding';

export const RedeemConsole: FC = () => {
  const { freeList, stakingPool, stakingPoolHelper, unbondingDuration } = useContext(StakingPoolContext);
  const [redeemType, setRedeemType] = useState<RedeemType>('Immediately');
  const [era, setEra] = useState<number>(0);

  const freeLiquidityCurrencyAmount = useMemo((): number => {
    if (!stakingPoolHelper) {
      return 0;
    }

    return stakingPoolHelper.communalFree.div(stakingPoolHelper.liquidExchangeRate).toNumber();
  }, [stakingPoolHelper]);

  const freeLiquidityCurrencyAmountInTarget = useMemo((): number => {
    if (!stakingPoolHelper) return 0;

    const _result = freeList.find((item): boolean => item.era === era);

    if (!_result) {
      return 0;
    }

    return _result.free.div(stakingPoolHelper.liquidExchangeRate).toNumber();
  }, [freeList, stakingPoolHelper, era]);

  const getMaxLiquidCurrencyAmount = (): number => {
    if (redeemType === 'Immediately') {
      return freeLiquidityCurrencyAmount;
    }

    if (redeemType === 'Target') {
      return freeLiquidityCurrencyAmountInTarget;
    }

    if (redeemType === 'WaitForUnbonding') {
      return Number.POSITIVE_INFINITY;
    }

    return 0;
  };

  const validator = useFormValidator({
    amount: {
      currency: stakingPool?.liquidCurrency,
      max: getMaxLiquidCurrencyAmount(),
      min: 0,
      type: 'balance'
    },
    target: {
      min: stakingPoolHelper?.currentEra,
      type: 'number'
    }
  });
  const form = useFormik({
    initialValues: {
      amount: (('' as any) as number),
      target: (('' as any) as number)
    },
    onSubmit: noop,
    validate: validator
  });

  if (!stakingPoolHelper || !stakingPool) {
    return null;
  }

  const getTargetEra = (): number => {
    if (redeemType === 'Immediately') {
      return stakingPoolHelper.currentEra;
    }

    if (redeemType === 'Target') {
      return era;
    }

    if (redeemType === 'WaitForUnbonding') {
      return stakingPool.currentEra.toNumber() + stakingPool.bondingDuration.toNumber() + 1;
    }

    return stakingPoolHelper.currentEra;
  };

  const info = {
    climeFee: stakingPoolHelper.claimFee(Fixed18.fromNatural(form.values.amount), getTargetEra()),
    redeemed: Fixed18.fromNatural(form.values.amount)
  };

  const listConfig = [
    {
      key: 'redeemed',
      /* eslint-disable-next-line react/display-name */
      render: (value: Fixed18): ReactNode => (
        value.isFinity() ? (
          <FormatBalance
            balance={value}
            currency={stakingPool.liquidCurrency}
          />
        ) : '~'
      ),
      title: 'Redeemed'
    },
    {
      key: 'climeFee',
      /* eslint-disable-next-line react/display-name */
      render: (value: Fixed18): ReactNode => (
        value.isFinity() ? (
          <FormatBalance
            balance={value}
            currency={stakingPool.liquidCurrency}
          />
        ) : '~'
      ),
      title: 'Claim Fee'
    }
  ];

  const checkDisabled = (): boolean => {
    if (!form.values.amount) {
      return true;
    }

    if (form.errors.amount) {
      return true;
    }

    return false;
  };

  const getParams = (): string[] => {
    const _params = [
      numToFixed18Inner(form.values.amount),
      redeemType as any
    ];

    if (redeemType === 'Target') {
      _params[1] = {
        Target: era
      };
    }

    return _params;
  };

  return (
    <Grid
      className={classes.root}
      container
      direction='column'
    >
      <Grid item>
        <p className={classes.notice}>Withdraw deposit and interest</p>
      </Grid>
      <Grid item>
        <div className={classes.select}>
          <Radio
            checked={redeemType === 'Immediately'}
            className={classes.item}
            label={`Redeem Now, Total Free is ${freeLiquidityCurrencyAmount} ${stakingPool.liquidCurrency}`}
            onClick={(): void => setRedeemType('Immediately')}
          />
          <Radio
            checked={redeemType === 'Target'}
            className={classes.item}
            disabled={!freeList.length}
            label={(
              <div className={classes.targetInput}>
                <span>Redeem in ERA</span>
                {
                  freeList.length ? (
                    <TargetRedeemList
                      className={classes.select}
                      onChange={setEra}
                      value={era}
                    />
                  ) : null
                }
                {
                  freeLiquidityCurrencyAmountInTarget ? `Free is ${freeLiquidityCurrencyAmountInTarget}` : null
                }
              </div>
            )}
            onClick={(): void => setRedeemType('Target')}
          />
          <Radio
            checked={redeemType === 'WaitForUnbonding'}
            className={classes.item}
            label='Redeem & Wait for Unbounding Period'
            onClick={(): void => setRedeemType('WaitForUnbonding')}
          />
        </div>
      </Grid>
      <Grid item>
        <BalanceInput
          error={form.errors.amount}
          id='amount'
          name='amount'
          onChange={form.handleChange}
          token={stakingPool.liquidCurrency}
          value={form.values.amount}
        />
      </Grid>
      <Grid item>
        <p className={classes.eraInfo}>
          Current Era = {stakingPoolHelper.currentEra} Unbounding Period = {formatDuration(unbondingDuration)} Days, Era {stakingPoolHelper.bondingDuration}
        </p>
      </Grid>
      <Grid container
        item
        justify='center'>
        <Grid item>
          <TxButton
            className={classes.txBtn}
            disabled={checkDisabled()}
            method='redeem'
            onSuccess={form.resetForm}
            params={getParams()}
            section='homa'
          >
            Redeem
          </TxButton>
        </Grid>
      </Grid>
      <Grid
        className={classes.info}
        item
      >
        <List config={listConfig}
          data={info}
          itemClassName={classes.listItem} />
      </Grid>
    </Grid>
  );
};
