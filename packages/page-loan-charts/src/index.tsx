import React, { FC } from 'react';

import { Page, Col, Row } from '@acala-dapp/ui-components';

import { LoanCollateralRatio } from './components/LoanCollateralRatio';
import { LoanLiquidationRatio } from './components/LoanLiquidationRatio';
import { TotalDebitAndCollateral } from './components/TotalDebitAndCollateral';
import { LoansOverview } from './components/LoansOverview';

const PageWallet: FC = () => {
  return (
    <Page fullscreen>
      <Page.Title breadcrumb='Loans'
        title='Stablecoin' />
      <Page.Content>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <TotalDebitAndCollateral />
          </Col>
          <Col span={12}>
            <LoanCollateralRatio />
          </Col>
          <Col span={12}>
            <LoanLiquidationRatio />
          </Col>
          <Col span={24}>
            <LoansOverview />
          </Col>
        </Row>
      </Page.Content>
    </Page>
  );
};

export default PageWallet;
