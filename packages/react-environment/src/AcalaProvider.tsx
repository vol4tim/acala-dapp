import React, { FC } from 'react';

import { NoAccounts, NoExtensions, ConnectError, AppSettings } from '@acala-dapp/react-components';
import { ApiProvider, AccountProvider, GlobalStoreProvider } from '@acala-dapp/react-environment';
import { BareProps } from '@acala-dapp/ui-components/types';

import { SettingProvider } from './SettingProvider';
import { RxStoreProvider } from './RxStore';
import './i18n';


interface AcalaProviderProps extends BareProps {
  applicationName: string;
}

export const AcalaProvider: FC<AcalaProviderProps> = ({
  applicationName = 'Acala Dapp',
  children
}) => {
  /* eslint-disable react/jsx-sort-props */
  return (
    <SettingProvider>
      <ApiProvider>
        <AccountProvider
          applicationName={applicationName}
          NoAccounts={<NoAccounts />}
          NoExtensions={<NoExtensions />}
        >
          <RxStoreProvider>
            <GlobalStoreProvider>
              <>
                {children}
                <ConnectError />
                <AppSettings />
              </>
            </GlobalStoreProvider>
          </RxStoreProvider>
        </AccountProvider>
      </ApiProvider>
    </SettingProvider>
  );
  /* eslint-enable react/jsx-sort-props */
};
