import React, { FC, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';

import { CurrencyId } from '@acala-network/types/interfaces';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { TokenName } from '@acala-dapp/react-components';
import { useIncentiveShare, getPoolId } from '@acala-dapp/react-hooks';
import { UserReward } from './reward-components';
import { CardRoot, Description, TokenImage, EarnNumber, EarnExtra, ActionContainer, ClimeBtn, ExtraBtn } from './components';

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

  const isShowClaim = useMemo((): boolean => {
    return !share.share.isZero();
  }, [share]);

  const isDisabledClaim = useMemo((): boolean => {
    if (!share.reward.isFinaite()) return false;

    return share.reward.isLessThan(new FixedPointNumber('0.0000001'));
  }, [share]);

  const params = useMemo(() => {
    return [getPoolId('Loans', currency)];
  }, [currency]);

  const goToLoan = useCallback(() => {
    navigate('/loan');
  }, [navigate]);

  return (
    <ActionContainer>
      {
        isShowClaim ? (
          <ClimeBtn
            disabled={isDisabledClaim}
            method='claimRewards'
            params={params}
            section='incentives'
          >
            Claim
          </ClimeBtn>
        ) : null
      }
      <ExtraBtn onClick={goToLoan} >
        Borrow aUSD
      </ExtraBtn>
    </ActionContainer>
  );
};

export const LoanRewardCard: FC<LoanRewardCardProps> = ({
  currency,
  rewardCurrency
}) => {
  return (
    <CardRoot>
      <TokenImage currency={currency} />
      <Description>
        Collateralize <TokenName currency={currency} />
      </Description>
      <EarnNumber>
        <UserReward
          currency={currency}
          poolId='Loans'
          rewardCurrency={rewardCurrency}
        />
      </EarnNumber>
      <EarnExtra>
        <TokenName currency={rewardCurrency}/> Earned
      </EarnExtra>
      <Action currency={currency} />
    </CardRoot>
  );
};
