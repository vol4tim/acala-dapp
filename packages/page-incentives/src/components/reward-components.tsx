import React, { FC } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { FormatBalance, FormatBlockTime } from '@acala-dapp/react-components';
import { useIncentiveShare, PoolId } from '@acala-dapp/react-hooks';

interface PoolRateProps {
  accumulatePeriod: number;
  rewardCurrency: CurrencyId;
  totalReward: FixedPointNumber;
}

export const PoolRate: FC<PoolRateProps> = ({
  accumulatePeriod,
  rewardCurrency,
  totalReward
}) => {
  return (
    <div>
      <FormatBalance
        balance={totalReward.times(new FixedPointNumber(60))}
        currency={rewardCurrency}
      /> /
      <FormatBlockTime
        block={accumulatePeriod * 60}
        to='hour'
      />
    </div>
  );
};

interface UserPoolRateProps extends PoolRateProps {
  currency: CurrencyId;
  poolId: PoolId;
}

export const UserPoolRate: FC<UserPoolRateProps> = ({
  accumulatePeriod,
  currency,
  poolId,
  rewardCurrency,
  totalReward
}) => {
  const share = useIncentiveShare(poolId, currency);

  return (
    <div>
      <FormatBalance
        balance={totalReward.times(share.ratio).times(new FixedPointNumber(60))}
        currency={rewardCurrency}
      /> /
      <FormatBlockTime
        block={accumulatePeriod * 60}
        to='hour'
      />
    </div>
  );
};

export const TotalReward: FC<{ currency: CurrencyId; rewardCurrency: CurrencyId; poolId: PoolId }> = ({ currency, poolId, rewardCurrency }) => {
  const share = useIncentiveShare(poolId, currency);

  return (
    <FormatBalance
      balance={share.totalReward}
      currency={rewardCurrency}
    />
  );
};

export const UserReward: FC<{ currency: CurrencyId; rewardCurrency: CurrencyId; poolId: PoolId }> = ({ currency, poolId, rewardCurrency }) => {
  const share = useIncentiveShare(poolId, currency);

  return (
    <FormatBalance
      balance={share.reward}
      currency={rewardCurrency}
    />
  );
};
