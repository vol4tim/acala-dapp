import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';

import { Tabs } from './components/Tabs';
import { IncentivesProvider } from './components/IncentivesProvider';

const PageDeposit: FC = () => {
  return (
    <IncentivesProvider>
      <Page>
        <Page.Title title='Incentives' />
        <Page.Content>
          <Grid container>
            <Grid item>
              <Tabs />
            </Grid>
          </Grid>
        </Page.Content>
      </Page>
    </IncentivesProvider>
  );
};

export default PageDeposit;
