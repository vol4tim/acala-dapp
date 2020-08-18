import React, { ReactNode, FC, useState, useEffect, useContext } from 'react';
import { timeout } from 'rxjs/operators';

import { ApiRx } from '@polkadot/api';
import { options } from '@acala-network/api';

import { createProvider } from './utils/endpoints';
import { SettingContext } from './SettingProvider';

const MAX_CONNECT_TIME = 1000 * 60; // one minute

interface ConnectStatus {
  connected: boolean;
  error: boolean;
  loading: boolean;
}

export interface ApiContextData {
  api: ApiRx;
  connected: boolean;
  error: boolean;
  loading: boolean;
  chain: string;
}

// ensure that api always exist
export const ApiContext = React.createContext<ApiContextData>({} as ApiContextData);

interface Props {
  children: ReactNode;
  Loading?: ReactNode;
}

/**
 * @name ApiProvider
 * @description connect chain in the Api Higher-Order Component.
 */
export const ApiProvider: FC<Props> = ({
  Loading,
  children
}) => {
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>(
    {} as ConnectStatus
  );
  const [api, setApi] = useState<ApiRx>({} as ApiRx);
  const [chain, setChain] = useState<string>('');
  const { endpoint } = useContext(SettingContext);

  const renderContent = (): ReactNode => {
    if (connectStatus.loading) {
      return Loading || null;
    }

    if (JSON.stringify(api) !== '{}') {
      return children;
    }
  };

  useEffect(() => {
    if (api.isConnected || !endpoint || !endpoint.length) return;

    // reset connect status
    setConnectStatus({ connected: false, error: false, loading: true });

    const subscriber = ApiRx.create(options({ provider: createProvider(endpoint) })).pipe(
      timeout(MAX_CONNECT_TIME)
    ).subscribe({
      error: (): void => {
        setConnectStatus({ connected: false, error: true, loading: false });
      },
      next: (result): void => {
        setApi(result);
        setConnectStatus({ connected: true, error: false, loading: false });
      }
    });

    return (): void => {
      subscriber.unsubscribe();

      if (api.disconnect) {
        api.disconnect();
      }
    };
  }, [api, endpoint]);

  useEffect(() => {
    if (!connectStatus.connected) return;

    api.rpc.system.chain().subscribe((result) => {
      setChain(result.toString());
    });
  }, [api, connectStatus]);

  useEffect(() => {
    if (!connectStatus.connected) return;

    api.on('disconnected', () => {
      setConnectStatus({ connected: false, error: true, loading: false });
    });
    api.on('error', () => {
      setConnectStatus({ connected: false, error: true, loading: false });
    });
    api.on('connected', () => {
      setConnectStatus({ connected: true, error: false, loading: false });
    });

    return (): void => api.disconnect();
  }, [api, connectStatus]);

  return (
    <ApiContext.Provider
      value={{
        api,
        chain,
        ...connectStatus
      }}
    >
      {renderContent()}
    </ApiContext.Provider>
  );
};
