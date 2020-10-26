import React, { FC, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';

import { CurrencyId } from '@acala-network/types/interfaces';
import { FixedPointNumber } from '@acala-network/sdk-core';

import classes from './RewardCard.module.scss';
import { Token, TokenName, TxButton } from '@acala-dapp/react-components';
import { List, Button } from '@acala-dapp/ui-components';
import { useIncentiveShare, getPoolId } from '@acala-dapp/react-hooks';
import { TotalReward, UserReward, PoolRate, UserPoolRate } from './reward-components';

interface DescriptionProps {
  rewardCurrency: CurrencyId;
  currency: CurrencyId;
}

const Description: FC<DescriptionProps> = ({
  currency,
  rewardCurrency
}) => {
  return (
    <div className={classes.decription}>
      Earn <TokenName currency={rewardCurrency}/> by create <TokenName currency={currency} /> loan
    </div>
  );
};

interface LoanRewardCardProps {
  currency: CurrencyId;
  rewardCurrency: CurrencyId;

  accumulatePeriod: number;
  totalReward: FixedPointNumber;
}

interface ActionProps {
  currency: CurrencyId;
}

const Action: FC<ActionProps> = ({ currency }) => {
  const share = useIncentiveShare('Loans', currency);
  const navigate = useNavigate();

  const isShowClaim = useMemo<boolean>((): boolean => {
    return !share.share.isZero();
  }, [share]);

  const params = useMemo(() => {
    return [getPoolId('Loans', currency)];
  }, [currency]);

  const goToLoan = useCallback(() => {
    navigate('/loan');
  }, [navigate]);

  return (
    <div className={classes.action}>
      {
        isShowClaim ? (
          <TxButton
            className={classes.btn}
            disabled={share.reward.isZero()}
            method='claimRewards'
            params={params}
            section='incentives'
          >
            Claim
          </TxButton>
        ) : null
      }
      <Button
        className={classes.btn}
        onClick={goToLoan}
      >{ share.share.isZero() ? 'Get Reward!' : 'Get More Reward!'}</Button>
    </div>
  );
};

export const LoanRewardCard: FC<LoanRewardCardProps> = ({
  accumulatePeriod,
  currency,
  rewardCurrency,
  totalReward
}) => {
  return (
    <div className={classes.root}>
      <Token
        currency={currency}
        icon
      />
      <Description
        currency={currency}
        rewardCurrency={rewardCurrency}
      />
      <List className={classes.information}>
        <List.Item
          label={'Pool Total Reward'}
          value={
            <TotalReward
              currency={currency}
              poolId='Loans'
              rewardCurrency={rewardCurrency}
            />
          }
        />
        <List.Item
          label={'Pool Rate'}
          value={
            <PoolRate
              accumulatePeriod={accumulatePeriod}
              rewardCurrency={rewardCurrency}
              totalReward={totalReward}
            />
          }
        />
        <List.Item
          label={'Your Rate'}
          value={
            <UserPoolRate
              accumulatePeriod={accumulatePeriod}
              currency={currency}
              poolId='Loans'
              rewardCurrency={rewardCurrency}
              totalReward={totalReward}
            />
          }
        />
        <List.Item
          label={'Your Earned'}
          value={
            <UserReward
              currency={currency}
              poolId='Loans'
              rewardCurrency={rewardCurrency}
            />
          }
        />
      </List>
      <Action currency={currency} />
    </div>
  );
};
