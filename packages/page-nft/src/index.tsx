import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';

import { NFTProvider } from './components/NFTProvider';
import { Tabs } from './components/Tabs';

const PageDeposit: FC = () => {
  return (
    <NFTProvider>
      <Page>
        <Page.Title title='NFT' />
        <Page.Content>
          <Grid container>
            <Grid item>
              <Tabs />
            </Grid>
          </Grid>
        </Page.Content>
      </Page>
    </NFTProvider>
  );
};

export default PageDeposit;
