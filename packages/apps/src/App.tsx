import React, { FC } from 'react';

import { UIProvider } from '@acala-dapp/ui-components';
import { AcalaProvider, RouterProvider } from '@acala-dapp/react-environment';
import { EventsWatcher } from '@acala-dapp/react-components';

import { config as routerConfig } from './router-config';
import './initI18n';

const App: FC = () => {
  return (
    <UIProvider>
      <AcalaProvider applicationName={'Acala Dapp'}>
        <RouterProvider config={routerConfig} />
        <EventsWatcher />
      </AcalaProvider>
    </UIProvider>
  );
};

export default App;
