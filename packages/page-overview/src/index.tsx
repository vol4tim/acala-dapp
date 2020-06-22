import React, { FC, useMemo } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import { Page, Grid } from '@acala-dapp/ui-components';

import { CDPCOllateralRatio } from './components/CDPCollateralRatio';
import { TotalDebitAndCollateral } from './components/TotalDebitAndCollateral';

const PageWallet: FC = () => {
  const client = useMemo<ApolloClient<any>>(() => {
    return new ApolloClient({
      uri: 'http://118.25.24.80:4000'
    });
  }, []);

  return (
    <ApolloProvider client={client}>
      <Page>
        <Page.Title title='Loans Overview' />
        <Page.Content>
          <Grid container
            direction='column'>
            <Grid item>
              <TotalDebitAndCollateral />
            </Grid>
            <CDPCOllateralRatio />
          </Grid>
        </Page.Content>
      </Page>
    </ApolloProvider>
  );
};

export default PageWallet;
