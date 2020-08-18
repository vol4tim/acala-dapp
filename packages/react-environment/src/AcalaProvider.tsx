import React, { FC } from 'react';

import { NoAccounts, NoExtensions, ConnectError } from '@acala-dapp/react-components';
import { FullLoading } from '@acala-dapp/ui-components';
import { ApiProvider, AccountProvider, GlobalStoreProvider } from '@acala-dapp/react-environment';
import { RxStoreProvider } from '@acala-dapp/react-components/RxStore';
import { BareProps } from '@acala-dapp/ui-components/types';

import { SettingProvider } from './SettingProvider';

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
      <ApiProvider Loading={<FullLoading />}>
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
              </>
            </GlobalStoreProvider>
          </RxStoreProvider>
        </AccountProvider>
      </ApiProvider>
    </SettingProvider>
  );
  /* eslint-enable react/jsx-sort-props */
};
