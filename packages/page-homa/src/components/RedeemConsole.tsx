import React, { FC, useContext, useState, useMemo, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { Fixed18 } from '@acala-network/app-util';
import { Grid, Radio, List, Condition } from '@acala-dapp/ui-components';
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
      equalMin: true,
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

  const targetEra = useMemo<number>((): number => {
    if (!stakingPoolHelper || !stakingPool) return 0;

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
  }, [stakingPoolHelper, stakingPool, era, redeemType]);

  const climeFee = useMemo<Fixed18>((): Fixed18 => {
    if (!stakingPoolHelper || !form.values.amount) return Fixed18.ZERO;

    return stakingPoolHelper.claimFee(Fixed18.fromNatural(form.values.amount), targetEra);
  }, [stakingPoolHelper, targetEra, form.values.amount]);

  const handleAmountInput = useCallback((value: number) => {
    form.setFieldValue('amount', value);
  }, [form]);

  if (!stakingPoolHelper || !stakingPool) {
    return null;
  }

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
          onChange={handleAmountInput}
          token={stakingPool.liquidCurrency}
          value={form.values.amount}
        />
      </Grid>
      <Grid item>
        <p className={classes.eraInfo}>
          Current Era = {stakingPoolHelper.currentEra} Unbounding Period = {formatDuration(unbondingDuration)} Days, Era {stakingPoolHelper.bondingDuration}
        </p>
      </Grid>
      <Grid
        container
        item
        justity='center'
      >
        <TxButton
          className={classes.txBtn}
          disabled={checkDisabled()}
          method='redeem'
          onExtrinsicSuccess={form.resetForm}
          params={getParams()}
          section='homa'
        >
          Redeem
        </TxButton>
      </Grid>
      <Grid
        className={classes.info}
        item
      >
        <List>
          <List.Item
            label='Redeemed'
            value={
              <Condition condition={form.values.amount}>
                <FormatBalance
                  balance={form.values.amount || 0}
                  currency={stakingPool.liquidCurrency}
                />
              </Condition>
            }
          />
          <List.Item
            label='Received'
            value={
              <Condition condition={form.values.amount}>
                ≈ <FormatBalance
                  balance={stakingPoolHelper.liquidExchangeRate.mul(Fixed18.fromNatural(form.values.amount).sub(climeFee)) || 0}
                  currency={stakingPool.stakingCurrency}
                />
              </Condition>
            }
          />
          <List.Item
            label='ClaimFee'
            value={
              <FormatBalance
                balance={climeFee}
                currency={stakingPool.liquidCurrency}
              />
            }
          />
        </List>
      </Grid>
    </Grid>
  );
};
