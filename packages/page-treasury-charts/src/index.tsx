import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';

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
      <Page.Content fullscreen>
        <Grid container>
          <Grid item>
            <AuctionOverview />
          </Grid>
          <Grid
            item
            span={24}>
            <AuctionList />
          </Grid>
        </Grid>
      </Page.Content>
    </Page>
  );
};

export default PageWallet;
