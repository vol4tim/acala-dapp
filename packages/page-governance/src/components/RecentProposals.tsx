import React, { FC } from 'react';
import { useRecentProposals } from '@acala-dapp/react-hooks';
import { Row, Col } from '@acala-dapp/ui-components';
import { ProposalCard } from './ProposalCard';

export const RecentProposals: FC = () => {
  const data = useRecentProposals();

  return (
    <Row gutter={[24, 24]}>
      {
        data.map((item, index) => {
          return (
            <Col
              key={item.council + index}
              span={24}
            >
              <ProposalCard {...item} />
            </Col>
          );
        })
      }
    </Row>
  );
};
