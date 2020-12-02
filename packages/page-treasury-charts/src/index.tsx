import React, { FC } from 'react';

import { Page, Row, Col } from '@acala-dapp/ui-components';

import { TreasuryOverview } from './components/TreasuryOverview';
import { AuctionOverview } from './components/AuctionOverview';
import { AuctionList } from './components/AuctionList';

const PageWallet: FC = () => {
  return (
    <Page fullscreen>
      <Page.Title title='Treasury' />
      <Page.Content>
        <TreasuryOverview />
      </Page.Content>
      <Page.Title title='Auction' />
      <Page.Content>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <AuctionOverview />
          </Col>
          <Col span={24}>
            <AuctionList />
          </Col>
        </Row>
      </Page.Content>
    </Page>
  );
};

export default PageWallet;
