import React, { FC } from 'react';

import { ConnectError, NoAccounts, NoExtensions } from '@acala-dapp/react-components';
import { FullLoading } from '@acala-dapp/ui-components';
import { ApiProvider, AccountProvider, GlobalStoreProvider } from '@acala-dapp/react-environment';
import { RxStoreProvider } from '@acala-dapp/react-components/RxStore';
import { BareProps } from '@acala-dapp/ui-components/types';

interface AcalaProviderProps extends BareProps {
  applicationName: string;
}

export const AcalaProvider: FC<AcalaProviderProps> = ({
  applicationName = 'Acala Dapp',
  children
}) => {
  return (
    <ApiProvider
      ConnectError={<ConnectError />}
      Loading={<FullLoading />}
    >
      <AccountProvider
        applicationName={applicationName}
        NoAccounts={<NoAccounts />}
        NoExtensions={<NoExtensions />}
      >
        <RxStoreProvider>
          <GlobalStoreProvider>
            {children}
          </GlobalStoreProvider>
        </RxStoreProvider>
      </AccountProvider>
    </ApiProvider>
  );
};
