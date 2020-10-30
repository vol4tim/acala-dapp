import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';
import { SwapConsole } from './components/SwapConsole';
import { LPInformations } from './components/LPInformations';
import { SwapProvider } from './components/SwapProvider';

const PageSwap: FC = () => {
  return (
    <SwapProvider>
      <Page>
        <Page.Title title='Swap' />
        <Page.Content>
          <Grid container>
            <Grid item>
              <SwapConsole />
            </Grid>
            <Grid item>
              <LPInformations />
            </Grid>
          </Grid>
        </Page.Content>
      </Page>
    </SwapProvider>
  );
};

export default PageSwap;
