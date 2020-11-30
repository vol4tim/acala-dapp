import { Row, Col, Page, Typology } from '@acala-dapp/ui-components';
import React, { FC } from 'react';

import AssetOverview from './components/AssetOverview';
import SystemOverview from './components/SystemOverview';
import Overview from './components/Overview';

const PageDashboardHome: FC = () => {
  return (
    <Page fullscreen>
      <Page.Title
        breadcrumb='Overview'
        title='Stablecoin'
      />
      <Page.Content>
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Overview />
          </Col>
          <Col span={24}>
            <Typology.Title>System Overview</Typology.Title>
          </Col>
          <Col span={24}>
            <SystemOverview />
          </Col>
          <Col span={24}>
            <AssetOverview />
          </Col>
        </Row>
      </Page.Content>
    </Page>
  );
};

export default PageDashboardHome;
