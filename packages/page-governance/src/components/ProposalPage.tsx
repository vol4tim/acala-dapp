import React, { FC, useCallback } from 'react';
import { usePageTitle } from '@acala-dapp/react-environment';
import { CouncilesTab } from './CouncliTab';
import { useProposals } from '@acala-dapp/react-hooks';
import { Col, Row } from '@acala-dapp/ui-components';
import { CouncilType } from '../config';
import { ProposalCard } from './ProposalCard';

const ProposalList: FC<{ council: string }> = ({ council }) => {
  console.log(council);

  const proposals = useProposals(council);

  return (
    <Row gutter={[24, 24]}>
      {
        proposals.map((item, index) => (
          <Col
            key={`proposal-${item.council}-${index}`}
            span={24}
          >
            <ProposalCard {...item} />
          </Col>
        ))
      }
    </Row>
  );
};

export const ProposalPage: FC = () => {
  usePageTitle({
    breadcrumb: [
      {
        content: 'Governance Overview',
        path: '/governance'
      }
    ],
    content: 'Council Proposals'
  });
  const councilRender = useCallback((council: CouncilType) => <ProposalList council={council} />, []);

  return (
    <CouncilesTab contentRender={councilRender} />
  );
};
