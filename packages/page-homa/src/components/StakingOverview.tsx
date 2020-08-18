import React, { FC, useMemo } from 'react';
import clsx from 'clsx';

import { Fixed18 } from '@acala-network/app-util';
import { Card } from '@acala-dapp/ui-components';

import classes from './StakingOverview.module.scss';
import { useStakingTotalAmount, useConstants, useStakingValue, useStakingRewardAPR } from '@acala-dapp/react-hooks';
import { FormatBalance, TokenName, FormatValue, FormatRatio } from '@acala-dapp/react-components';
import { Balance as BalanceBlock } from '@acala-dapp/react-components/WalletBalance';
import balanceClasses from '@acala-dapp/react-components/WalletBalance.module.scss';

const Stake: FC = () => {
  const amount = useStakingTotalAmount();
  const value = useStakingValue();
  const { stakingCurrency } = useConstants();

  return (
    <div className={clsx(classes.stake, classes.card)}>
      <p className={classes.title}>Stake Balance</p>
      <FormatBalance
        balance={amount}
        className={classes.stakingAmount}
        currency={stakingCurrency}
      />
      <FormatValue
        className={classes.stakingValue}
        data={value}
      />
    </div>
  );
};

const Balance: FC = () => {
  const { liquidCurrency, stakingCurrency } = useConstants();

  return (
    <div className={clsx(classes.balance, classes.card)}>
      <p className={classes.title}>Wallet Balance</p>
      <div className={classes.balanceContainer}>
        {
          [stakingCurrency, liquidCurrency].map((currency) => {
            return (
              <BalanceBlock
                className={clsx(classes.balanceBlock, balanceClasses.item)}
                currency={currency}
                key={`staking-balance-${currency}`}
              />
            );
          })
        }
      </div>
    </div>
  );
};

const Property: FC = () => {
  const APR = useStakingRewardAPR();
  const amount = useStakingTotalAmount();
  const { stakingCurrency } = useConstants();

  const profitOneDay = useMemo<Fixed18>(() => {
    if (!APR || !amount) return Fixed18.ZERO;

    return amount.mul(APR).div(Fixed18.fromNatural(365));
  }, [APR, amount]);

  return (
    <div className={classes.property}>
      <div className={classes.wrapper}>
        <div className={classes.content}>
          <div className={clsx(classes.inner, classes.profit)}>
            <p className={classes.label}>Profit/Day</p>
            <FormatBalance
              balance={profitOneDay}
              className={classes.data}
            />
            <TokenName
              className={classes.tokenName}
              currency={stakingCurrency}
            />
          </div>
          <div className={clsx(classes.inner, classes.APR)}>
            <p className={classes.label}>Net APR</p>
            <FormatRatio
              className={classes.data}
              data={APR}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const StakingOverview: FC = () => {
  return (
    <Card
      contentClassName={classes.root}
      padding={false}
    >
      <Stake />
      <Property />
      <Balance />
    </Card>
  );
};
