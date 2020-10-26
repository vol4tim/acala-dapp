import React, { FC } from 'react';

import { NoAccounts, NoExtensions, ConnectStatus, AppSettings } from '@acala-dapp/react-components';
import { ApiProvider } from './ApiProvider';
import { AccountProvider } from './AccountProvider';
import { BareProps } from '@acala-dapp/ui-components/types';

import { SettingProvider } from './SettingProvider';
import { RxStoreProvider } from './RxStore';
import { StoreProvier } from './store';

interface AcalaProviderProps extends BareProps {
  applicationName: string;
}

export const AcalaProvider: FC<AcalaProviderProps> = ({
  applicationName = 'Acala Dapp',
  children
}) => {
  return (
    <SettingProvider>
      <ApiProvider>
        <AccountProvider
          applicationName={applicationName}
          NoAccounts={<NoAccounts />}
          NoExtensions={<NoExtensions />}
        >
          <StoreProvier>
            <RxStoreProvider>
              <>
                {children}
                <ConnectStatus />
                <AppSettings />
              </>
            </RxStoreProvider>
          </StoreProvier>
        </AccountProvider>
      </ApiProvider>
    </SettingProvider>
  );
};
