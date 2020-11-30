import React, { FC } from 'react';

import { Row, Col, Page, Tabs } from '@acala-dapp/ui-components';

import Oracles from './components/Oracles';
import PriceChart from './components/PriceChart';

const PageDashboardHome: FC = () => {
  const oracleCurrency = ['DOT', 'XBTC', 'RENBTC'];

  return (
    <Page fullscreen>
      <Page.Title title='Oracles' />
      <Page.Content>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Oracles />
          </Col>
          <Col span={24}>
            <Page.Title title='Price Feeds' />
            <Tabs type='button'>
              {oracleCurrency.map((item: any) => {
                return (
                  <Tabs.Panel key={item.toString()}
                    tab={item}
                  >
                    <PriceChart currency={item} />
                  </Tabs.Panel>
                );
              })}
            </Tabs>
          </Col>
        </Row>
      </Page.Content>
    </Page>
  );
};

export default PageDashboardHome;
