import React, { FC, useCallback, useMemo } from 'react';

import { FixedPointNumber } from '@acala-network/sdk-core';
import { Row, Col, List, FlexBox } from '@acala-dapp/ui-components';
import { TxButton, BalanceInput, FormatBalance, BalanceInputValue, eliminateGap } from '@acala-dapp/react-components';
import { useBalance, useInputValue, useConstants, useStakingRewardERA, useStakingPool, useBalanceValidator } from '@acala-dapp/react-hooks';

import classes from './StakingConsole.module.scss';

export const StakingConsole: FC = () => {
  const { liquidCurrency, stakingCurrency } = useConstants();
  const stakingPool = useStakingPool();
  const rewardRate = useStakingRewardERA();
  const balance = useBalance(stakingCurrency);

  const [stakingValue, setStakingValue, { error, ref, reset, setValidator }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: stakingCurrency
  });

  useBalanceValidator({
    checkBalance: true,
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
        new FixedPointNumber('0.000001')
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
    <Row
      className={classes.root}
      gutter={[24, 24]}
    >
      <Col span={24}>
        <p className={classes.notice}>
          Deposit DOT & Mint Liquid DOT (L-DOT). Your DOTs will be staked to earn returns, meanwhile you can use, trade and invest L-DOT balance in your wallet.
        </p>
      </Col>
      <Col span={24}>
        <BalanceInput
          error={error}
          onChange={setStakingValue}
          onMax={handleMax}
          value={stakingValue}
        />
      </Col>
      <Col span={24}>
        <FlexBox
          alignItems='center'
          justifyContent='center'
        >
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
        </FlexBox>
      </Col>
      <Col span={24}>
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
      </Col>
    </Row>
  );
};
