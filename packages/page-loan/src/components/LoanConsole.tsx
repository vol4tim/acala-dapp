import React, { FC, useContext } from 'react';

import { Row, Col } from '@acala-dapp/ui-components';

import { LoanContext } from './LoanProvider';
import { DebitConsole, CollateralConsole } from './OperatorConsole';
import { LiquidationPriceCard } from './LiquidationPriceCard';
import { LiquidationRatioCard } from './LiquidationRatioCard';

export const LoanConsole: FC = () => {
  const { currentTab } = useContext(LoanContext);

  if (typeof currentTab === 'string') return null;

  return (
    <Row gutter={[24, 24]}>
      <Col span={12}>
        <LiquidationPriceCard currency={currentTab} />
      </Col>
      <Col span={12}>
        <LiquidationRatioCard currency={currentTab} />
      </Col>
      <Col span={12}>
        <DebitConsole currency={currentTab} />
      </Col>
      <Col span={12}>
        <CollateralConsole currency={currentTab} />
      </Col>
    </Row>
  );
};
