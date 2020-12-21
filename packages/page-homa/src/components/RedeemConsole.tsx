import React, { FC, useState, useMemo, useCallback } from 'react';

import { FixedPointNumber } from '@acala-network/sdk-core';
import { Row, Col, Radio, List, Condition, FlexBox } from '@acala-dapp/ui-components';
import { TxButton, BalanceInput, formatDuration, FormatBalance, BalanceInputValue, getTokenName } from '@acala-dapp/react-components';
import { useStakingPool, useStakingPoolFreeList, useBalance, useConstants, useInputValue, useBalanceValidator } from '@acala-dapp/react-hooks';

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

  const duration = useMemo((): number => {
    if (!stakingPool) return 0;

    const { derive: { bondingDuration, eraLength } } = stakingPool;

    return eraLength.toNumber() * bondingDuration.toNumber() * 4 * 1000;
  }, [stakingPool]);

  const freeLiquidityCurrencyAmount = useMemo((): FixedPointNumber => {
    if (!stakingPool) return FixedPointNumber.ZERO;

    return stakingPool.stakingPool.getFreeUnbondedRatio().times(stakingPool.stakingPool.getTotalCommunalBalance());
  }, [stakingPool]);

  const freeLiquidityCurrencyAmountInTarget = useMemo((): FixedPointNumber => {
    if (!stakingPool) return FixedPointNumber.ZERO;

    const _result = freeList.find((item): boolean => item.era === era);

    if (!_result) return FixedPointNumber.ZERO;

    return _result.amount.div(stakingPool.stakingPool.liquidExchangeRate());
  }, [freeList, stakingPool, era]);

  const maxLiquidCurrencyAmount = useMemo((): FixedPointNumber => {
    if (redeemType === 'Immediately') return freeLiquidityCurrencyAmount;

    if (redeemType === 'Target') return freeLiquidityCurrencyAmountInTarget;

    if (redeemType === 'WaitForUnbonding') return liquidBalnace;

    return FixedPointNumber.ZERO;
  }, [freeLiquidityCurrencyAmount, freeLiquidityCurrencyAmountInTarget, liquidBalnace, redeemType]);

  const [liquidValue, setLiquidValue, { error, reset, setValidator }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: liquidCurrency
  });

  useBalanceValidator({
    currency: liquidCurrency,
    max: [maxLiquidCurrencyAmount, ''],
    updateValidator: setValidator
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

  const isDisabled = useMemo((): boolean => {
    if (error) return true;

    if (!liquidValue.amount) return true;

    return false;
  }, [liquidValue, error]);

  const handleInput = useCallback((value: Partial<BalanceInputValue>) => {
    setLiquidValue(value);

    if (!stakingPool || !value.amount) return;

    if (redeemType === 'Immediately') {
      const result = stakingPool.stakingPool.getStakingAmountInRedeemByFreeUnbonded(
        new FixedPointNumber(value.amount)
      );

      setReceived(result.received);
      setFee(result.fee);
    }

    if (redeemType === 'Target') {
      const claimedConfig = freeList.find((item) => item.era === targetEra);

      if (!claimedConfig) return;

      const result = stakingPool.stakingPool.getStakingAmountInClaimUnbonding(
        new FixedPointNumber(value.amount),
        targetEra,
        {
          claimedUnbonding: claimedConfig.claimedUnbonding,
          initialClaimedUnbonding: claimedConfig.initialClaimedUnbonding,
          unbonding: claimedConfig.unbonding
        }
      );

      setReceived(result.received);
      setFee(result.fee);
    }

    if (redeemType === 'WaitForUnbonding') {
      const result = stakingPool.stakingPool.getStakingAmountInRedeemByUnbond(
        new FixedPointNumber(value.amount)
      );

      setReceived(result.amount);
    }
  }, [stakingPool, setLiquidValue, redeemType, setReceived, setFee, targetEra, freeList]);

  const handleMax = useCallback(() => {
    handleInput({ amount: maxLiquidCurrencyAmount.toNumber() });
  }, [handleInput, maxLiquidCurrencyAmount]);

  const handleTypeChange = useCallback((value: RedeemType) => {
    setRedeemType(value);
    reset();
    setFee(FixedPointNumber.ZERO);
    setReceived(FixedPointNumber.ZERO);
  }, [setRedeemType, reset]);

  const params = useMemo((): string[] => {
    const _params = [
      new FixedPointNumber(liquidValue.amount || 0).toChainData(),
      redeemType as any
    ];

    if (redeemType === 'Target') {
      _params[1] = {
        Target: targetEra
      };
    }

    return _params;
  }, [liquidValue, targetEra, redeemType]);

  const handleSuccess = useCallback(() => {
    reset();
    setReceived(FixedPointNumber.ZERO);
    setFee(FixedPointNumber.ZERO);
  }, [reset, setReceived, setFee]);

  return (
    <Row
      className={classes.root}
      gutter={[24, 24]}
    >
      <Col span={24}>
        <p className={classes.notice}>Withdraw deposit and interest</p>
      </Col>
      <Col span={24}>
        <div className={classes.select}>
          <Radio
            checked={redeemType === 'Immediately'}
            className={classes.item}
            label={`Redeem Now, Total Free is ${freeLiquidityCurrencyAmount.toNumber()} ${getTokenName(liquidCurrency.asToken.toString())}`}
            onClick={(): void => handleTypeChange('Immediately')}
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
                  freeLiquidityCurrencyAmountInTarget ? `Free is ${freeLiquidityCurrencyAmountInTarget.toNumber()}` : null
                }
              </div>
            )}
            onClick={(): void => handleTypeChange('Target')}
          />
          <Radio
            checked={redeemType === 'WaitForUnbonding'}
            className={classes.item}
            label='Redeem & Wait for Unbounding Period'
            onClick={(): void => handleTypeChange('WaitForUnbonding')}
          />
        </div>
      </Col>
      <Col span={24}>
        <BalanceInput
          error={error}
          onChange={handleInput}
          onMax={handleMax}
          value={liquidValue}
        />
      </Col>
      <Col span={24}>
        <p className={classes.eraInfo}>
          Current Era = {stakingPool?.derive.currentEra.toNumber()} Unbounding Period = {formatDuration(duration)} Days, Era {stakingPool?.derive.bondingDuration.toNumber()}
        </p>
      </Col>
      <Col span={24}>
        <FlexBox
          alignItems='center'
          justifyContent='center'
        >
          <TxButton
            className={classes.txBtn}
            disabled={isDisabled}
            method='redeem'
            onInblock={handleSuccess}
            params={params}
            section='homa'
          >
            Redeem
          </TxButton>
        </FlexBox>
      </Col>
      <Col
        className={classes.info}
        span={24}
      >
        <List>
          <List.Item
            label='Redeemed'
            value={
              <Condition condition={!!liquidValue.amount}>
                <FormatBalance
                  balance={new FixedPointNumber(liquidValue.amount || 0)}
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
          <Condition condition={redeemType !== 'WaitForUnbonding'}>
            <List.Item
              label='ClaimFee'
              value={
                <Condition condition={!fee.isZero()}>
                  <FormatBalance
                    balance={fee}
                    currency={stakingCurrency}
                  />
                </Condition>
              }
            />
          </Condition>
        </List>
      </Col>
    </Row>
  );
};
