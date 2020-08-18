import React, { FC } from 'react';

import { Grid, Page, Tabs } from '@acala-dapp/ui-components';

import Oracles from './components/Oracles';
import PriceChart from './components/PriceChart';

const PageDashboardHome: FC = () => {
  const oracleCurrency = ['DOT', 'XBTC', 'RENBTC'];

  return (
    <Page fullscreen>
      <Page.Title title='Oracles' />
      <Page.Content>
        <Grid container>
          <Grid item>
            <Oracles />
          </Grid>
          <Grid item>
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
          </Grid>
        </Grid>
      </Page.Content>
    </Page>
  );
};

export default PageDashboardHome;
