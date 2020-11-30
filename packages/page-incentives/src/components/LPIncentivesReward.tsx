import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useDexIncentiveReward } from '@acala-dapp/react-hooks';
import { styled, GridBox, Row, Col, InformationRoot, InformationTitle, Button } from '@acala-dapp/ui-components';

import { LPRewardCard } from './LPRewardCard';

const CInformationRoot = styled(InformationRoot)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 21px 24px;
`;

const CInformationTitle = styled(InformationTitle)`
  width: 60%;
  margin-bottom: 0;
`;

const InformationExtraBtn = styled(Button)`
  height: 40px;
  border-radius: 40px; 
  background: #f94444 !important;
`;

export const LPIncentivesReward: FC = () => {
  const { params, rewardPool } = useDexIncentiveReward();
  const navigate = useNavigate();

  const goToLoan = useCallback(() => {
    navigate({ pathname: '/swap?tab=add-liquidity' });
  }, [navigate]);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <CInformationRoot>
          <CInformationTitle>
            On top of the Swap fees earned by providing liquidity, by staking your LP tokens, you will earn additional aUSD from stability fee, and ACA from the distribution program.
          </CInformationTitle>
          <InformationExtraBtn onClick={goToLoan}>
            Get LP Tokens
          </InformationExtraBtn>
        </CInformationRoot>
      </Col>
      <Col span={24}>
        <GridBox
          column={4}
          padding={40}
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
      </Col>
    </Row>
  );
};
