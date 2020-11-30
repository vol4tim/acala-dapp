import React, { FC } from 'react';

import { Row, Col } from '@acala-dapp/ui-components';

import { StakingOverview } from './StakingOverview';
import { ExpressConsole } from './ExpressConsole';

export const Express: FC = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <StakingOverview />
      </Col>
      <Col span={24}>
        <ExpressConsole />
      </Col>
    </Row>
  );
};
