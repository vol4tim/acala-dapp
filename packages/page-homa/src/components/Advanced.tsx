import React, { FC } from 'react';

import { Row, Col } from '@acala-dapp/ui-components';

import { StakingTokeBalances } from './StakingTokenBalances';
import { SystemInfo } from './SystemInfo';
import { Console } from './Console';
import { StakingPool } from './StakingPool';
import { RedeemList } from './RedeemList';

export const Advanced: FC = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Console />
          </Col>
          <Col span={12}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <StakingTokeBalances />
              </Col>
              <Col span={24}>
                <SystemInfo />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <RedeemList />
      <Col span={24}>
        <StakingPool />
      </Col>
    </Row>
  );
};
