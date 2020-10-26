import React, { FC } from 'react';
import { useDexIncentiveReward } from '@acala-dapp/react-hooks';
import { GridBox } from '@acala-dapp/ui-components';
import { LPRewardCard } from './LPRewardCard';

export const LPIncentivesReward: FC = () => {
  const { params, rewardPool } = useDexIncentiveReward();

  return (
    <GridBox
      column={2}
      row={'auto'}
    >
      {
        rewardPool.map((item) => (
          <LPRewardCard
            accumulatePeriod={params.accumulatePeriod}
            key={`lp-reward-${item.currency.toString()}`}
            lp={item.currency}
            rewardCurrency={params.currency}
            totalReward={item.reward}
          />
        ))
      }
    </GridBox>
  );
};
