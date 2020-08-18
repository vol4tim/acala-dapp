import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';

import { GovernanceProvider } from './components/provider';
import { PageTypeSelector } from './components/PageTypeSelector';
import { CouncilSelector } from './components/CouncilSelector';
import { Content } from './components/Content';

const PageWallet: FC = () => {
  return (
    <Page>
      <Page.Title title='Governance' />
      <Page.Content>
        <GovernanceProvider>
          <Grid container>
            <Grid item>
              <PageTypeSelector />
            </Grid>
            <Grid item>
              <CouncilSelector />
            </Grid>
            <Grid item>
              <Content />
            </Grid>
          </Grid>
        </GovernanceProvider>
      </Page.Content>
    </Page>
  );
};

export default PageWallet;
