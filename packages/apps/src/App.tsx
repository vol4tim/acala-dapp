import React, { FC, useMemo } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { UIProvider, Notification } from '@acala-dapp/ui-components';
import { AcalaProvider } from '@acala-dapp/react-environment';

import { RouterProvider } from './components/RouterProvider';
import { config as routerConfig } from './router-config';

const App: FC = () => {
  const client = useMemo<ApolloClient<any>>(() => {
    return new ApolloClient({ uri: 'http://118.25.24.80:4000' });
  }, []);

  return (
    <ApolloProvider client={client}>
      <UIProvider>
        <Notification>
          <AcalaProvider applicationName={'Acala Dapp'}>
            <RouterProvider config={routerConfig} />
          </AcalaProvider>
        </Notification>
      </UIProvider>
    </ApolloProvider>
  );
};

export default App;
