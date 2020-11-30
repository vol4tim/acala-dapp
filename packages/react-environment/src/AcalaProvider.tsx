import React, { FC } from 'react';

import { ConnectStatus, AppSettings } from '@acala-dapp/react-components';
import { BareProps } from '@acala-dapp/ui-components/types';

import { ApiProvider } from './ApiProvider';
import { SettingProvider } from './SettingProvider';
import { RxStoreProvider } from './RxStore';
import { StoreProvier } from './store';
import { ExtensionProvider } from './ExtensionProvider';

interface AcalaProviderProps extends BareProps {
  applicationName: string;
  applicationVersion?: string;
}

export const AcalaProvider: FC<AcalaProviderProps> = ({
  applicationName = 'Acala Dapp',
  children
}) => {
  return (
    <SettingProvider>
      <ApiProvider>
        <ExtensionProvider appName={applicationName}>
          <StoreProvier>
            <RxStoreProvider>
              <>
                {children}
                <ConnectStatus />
                <AppSettings />
              </>
            </RxStoreProvider>
          </StoreProvier>
        </ExtensionProvider>
      </ApiProvider>
    </SettingProvider>
  );
};
