import { Grid, Page } from '@acala-dapp/ui-components';
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
        <Overview />
      </Page.Content>
      <Page.Title title='System Overview' />
      <Page.Content fullscreen>
        <Grid container>
          <Grid item>
            <SystemOverview />
          </Grid>
          <Grid
            item
            span={24}
          >
            <AssetOverview />
          </Grid>
        </Grid>
      </Page.Content>
    </Page>
  );
};

export default PageDashboardHome;
