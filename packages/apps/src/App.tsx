import React, { FC, useMemo } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { UIProvider } from '@acala-dapp/ui-components';
import { AcalaProvider } from '@acala-dapp/react-environment';
import { EventsWatcher } from '@acala-dapp/react-components';

import { RouterProvider } from './components/RouterProvider';
import { config as routerConfig } from './router-config';
import './initI18n';

const App: FC = () => {
  const client = useMemo<ApolloClient<any>>(() => {
    return new ApolloClient({ uri: 'http://118.25.24.80:4000' });
  }, []);

  return (
    <ApolloProvider client={client}>
      <UIProvider>
        <AcalaProvider applicationName={'Acala Dapp'}>
          <RouterProvider config={routerConfig} />
          <EventsWatcher />
        </AcalaProvider>
      </UIProvider>
    </ApolloProvider>
  );
};

export default App;
