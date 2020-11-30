import { Page, Row, Col } from '@acala-dapp/ui-components';
import React, { FC } from 'react';

import CollateralAuctionList from './components/CollateralAuctionList';

const PageDashboardHome: FC = () => {
  return (
    <Page fullscreen>
      <Page.Title breadcrumb='Liquidations'
        title='Stablecoin' />
      <Page.Content>
        <Row gutter={[24, 24]}>
          <Col>
            <CollateralAuctionList />
          </Col>
        </Row>
      </Page.Content>
    </Page>
  );
};

export default PageDashboardHome;
