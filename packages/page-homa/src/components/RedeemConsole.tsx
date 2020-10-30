import React, { FC, useContext, useState, useMemo, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { FixedPointNumber } from '@acala-network/sdk-core';
import { Grid, Radio, List, Condition } from '@acala-dapp/ui-components';
import { TxButton, BalanceInput, numToFixed18Inner, formatDuration, FormatBalance, BalanceInputValue, getTokenName } from '@acala-dapp/react-components';
import { useFormValidator, useStakingPool, useStakingPoolFreeList, useBalance, useConstants, useInputValue } from '@acala-dapp/react-hooks';

import classes from './RedeemConsole.module.scss';
import { TargetRedeemList } from './TargetRedeemList';

type RedeemType = 'Immediately' | 'Target' | 'WaitForUnbonding';

export const RedeemConsole: FC = () => {
  const { liquidCurrency, stakingCurrency } = useConstants();
  const stakingPool = useStakingPool();
  const freeList = useStakingPoolFreeList();
  const [redeemType, setRedeemType] = useState<RedeemType>('Immediately');
  const [era, setEra] = useState<number>(0);
  const liquidBalnace = useBalance(liquidCurrency);

  const [received, setReceived] = useState<FixedPointNumber>(FixedPointNumber.ZERO);
  const [fee, setFee] = useState<FixedPointNumber>(FixedPointNumber.ZERO);
  const [unbondinngEar, setUnbondinngEar] = useState<number>(0);

  const freeLiquidityCurrencyAmount = useMemo((): FixedPointNumber => {
    if (!stakingPool) {
      return FixedPointNumber.ZERO;
    }

    return stakingPool.stakingPool.getFreeUnbondedRatio().times(stakingPool.stakingPool.getTotalCommunalBalance());
  }, [stakingPool]);

  const freeLiquidityCurrencyAmountInTarget = useMemo((): FixedPointNumber => {
    if (!stakingPool) return FixedPointNumber.ZERO;

    const _result = freeList.find((item): boolean => item.era === era);

    if (!_result) {
      return FixedPointNumber.ZERO;
    }

    return _result.amount.div(stakingPool.stakingPool.liquidExchangeRate());
  }, [freeList, stakingPool, era]);

  const getMaxLiquidCurrencyAmount = (): FixedPointNumber => {
    if (redeemType === 'Immediately') {
      return freeLiquidityCurrencyAmount;
    }

    if (redeemType === 'Target') {
      return freeLiquidityCurrencyAmountInTarget;
    }

    if (redeemType === 'WaitForUnbonding') {
      return liquidBalnace;
    }

    return FixedPointNumber.ZERO;
  };

  const [liquidValue, setLiquidValue, { reset }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: liquidCurrency
  });

  const targetEra = useMemo<number>((): number => {
    if (!stakingPool) return 0;

    if (redeemType === 'Immediately') {
      return stakingPool.derive.currentEra.toNumber();
    }

    if (redeemType === 'Target') {
      return era;
    }

    if (redeemType === 'WaitForUnbonding') {
      return stakingPool.derive.currentEra.toNumber() + stakingPool.derive.bondingDuration.toNumber() + 1;
    }

    return stakingPool.derive.currentEra.toNumber();
  }, [stakingPool, era, redeemType]);

  const climeFee = useMemo<FixedPointNumber>((): FixedPointNumber => {
    if (!stakingPool || !redeemType) return FixedPointNumber.ZERO;

    return FixedPointNumber.ZERO;
  }, [stakingPool, redeemType]);

  const isDisabled = useMemo((): boolean => {
    if (liquidValue.amount) {
      return false;
    }

    return true;
  }, [liquidValue]);

  const handleInput = useCallback((value: BalanceInputValue) => {
    setLiquidValue(value);
  }, [stakingPool, liquidValue, setLiquidValue, redeemType]);

  const params = useMemo((): string[] => {
    const _params = [
      new FixedPointNumber(liquidValue.amount).toChainData(),
      redeemType as any
    ];

    if (redeemType === 'Target') {
      _params[1] = {
        Target: era
      };
    }

    return _params;
  }, [liquidValue, era, redeemType]);

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
            label={`Redeem Now, Total Free is ${freeLiquidityCurrencyAmount} ${getTokenName(liquidCurrency.asToken.toString())}`}
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
          onChange={handleInput}
          value={liquidValue}
        />
      </Grid>
      <Grid item>
        <p className={classes.eraInfo}>
          Current Era = {stakingPool?.derive.currentEra.toNumber()} Unbounding Period = {formatDuration(era)} Days, Era {stakingPool?.derive.bondingDuration.toNumber()}
        </p>
      </Grid>
      <Grid
        container
        item
        justity='center'
      >
        <TxButton
          className={classes.txBtn}
          disabled={isDisabled}
          method='redeem'
          onExtrinsicSuccess={reset}
          params={params}
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
              <Condition condition={!!liquidValue.amount}>
                <FormatBalance
                  balance={new FixedPointNumber(liquidValue.amount)}
                  currency={liquidCurrency}
                />
              </Condition>
            }
          />
          <List.Item
            label='Received'
            value={
              <Condition condition={!received.isZero()}>
                ≈ <FormatBalance
                  balance={received}
                  currency={stakingCurrency}
                />
              </Condition>
            }
          />
          <List.Item
            label='ClaimFee'
            value={
              <FormatBalance
                balance={climeFee}
                currency={liquidCurrency}
              />
            }
          />
        </List>
      </Grid>
    </Grid>
  );
};
