import React, { FC } from 'react';

import { ConnectError, NoAccounts, NoExtensions } from '@acala-dapp/react-components';
import { UIProvider, Notification, FullLoading } from '@acala-dapp/ui-components';
import { ApiProvider, AccountProvider, GlobalStoreProvider } from '@acala-dapp/react-environment';
import { useAppSetting } from '@acala-dapp/react-hooks/useAppSetting';
import { RxStoreProvider } from '@acala-dapp/react-components/RxStore';

import { RouterProvider } from './components/RouterProvider';
import { config as routerConfig } from './router-config';

const App: FC = () => {
  const { endpoint } = useAppSetting();

  return (
    <UIProvider>
      <Notification>
        <ApiProvider
          ConnectError={<ConnectError />}
          Loading={<FullLoading />}
          endpoint={endpoint}
        >
          <AccountProvider
            NoAccounts={<NoAccounts />}
            NoExtensions={<NoExtensions />}
            applicationName={'Acala Dapp'}
          >
            <RxStoreProvider>
              <GlobalStoreProvider>
                <RouterProvider config={routerConfig} />
              </GlobalStoreProvider>
            </RxStoreProvider>
          </AccountProvider>
        </ApiProvider>
      </Notification>
    </UIProvider>
  );
};

export default App;
