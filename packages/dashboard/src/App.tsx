import React, { FC } from 'react';

import { UIProvider } from '@acala-dapp/ui-components';
import { AcalaProvider, ChartDataProvider, RouterProvider } from '@acala-dapp/react-environment';
import { EventsWatcher } from '@acala-dapp/react-components';

import { config as routerConfig } from './router-config';

const CHARTDATA_URL = 'http://39.99.168.67:8086';
const CHARTDATA_READONLY_TOKEN = 'piy6tjT8PkJmWZAR3TahGUP3uWWB5jcl-0rv0gwcEVlynllxrntp9UCBdnbMsqUtIIPgeUaVMnq1x2r9TvUDwg==';

const App: FC = () => {
  return (
    <ChartDataProvider
      token={CHARTDATA_READONLY_TOKEN}
      url={CHARTDATA_URL}
    >
      <UIProvider>
        <AcalaProvider applicationName={'Acala Dapp'}>
          <>
            <RouterProvider config={routerConfig} />
            <EventsWatcher />
          </>
        </AcalaProvider>
      </UIProvider>
    </ChartDataProvider>
  );
};

export default App;
