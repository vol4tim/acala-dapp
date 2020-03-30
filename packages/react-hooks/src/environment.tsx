import React, { ReactNode, FC, useState, useEffect } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@acala-network/api/build";

const DEFAULT_ENDPOINT = "wss://node-6640517791634960384.jm.onfinality.io/ws";

const CONNECT_TIMEOUT = 1000 * 60; // one minute

interface EnvironmentProps {
  endpoint?: string;
  children: ReactNode;
}

interface ConnectStatus {
  loading: boolean;
  connected: boolean;
  error: boolean;
}

export interface EnvironmentData {
  api: ApiPromise;
  loading: boolean;
  connected: boolean;
  error: boolean;
  endpoint: string;
  setEndpoint: (enpoint: string) => void;
}

export const EnvironmentContext = React.createContext<EnvironmentData>(
  {} as EnvironmentData
);

/**
 * @name Environment
 * @description connect chain in the Environment Higher-Order Component.
 * useage:
 *  <Environment endpoint={ENDPOINT} >
 *      {...something}
 *  </Environment>
 */
export const Environment: FC<EnvironmentProps> = ({
  endpoint = DEFAULT_ENDPOINT,
  children
}) => {
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>(
    {} as ConnectStatus
  );
  const [_endpoint, _setEndpoint] = useState<string>(endpoint);
  const [api, setApi] = useState<ApiPromise>({} as ApiPromise);
  const setEndpoint = (endpoint: string) => _setEndpoint(endpoint);

  useEffect(() => {
    // reset connect status
    setConnectStatus({
      loading: true,
      connected: false,
      error: false
    });
    // content endpoint
    const provider = new WsProvider(_endpoint);
    // @ts-ignore
    ApiPromise.create(options({ provider })).then((api: ApiPromise) => {
      setApi(api);
      setConnectStatus({
        loading: false,
        connected: true,
        error: false
      });
    });
  }, [_endpoint]);

  useEffect(() => {
    if (!connectStatus.connected) return;
    api.on("disconnected", () => {
      setConnectStatus({ ...connectStatus, error: true });
    });
    api.on("error", () => {
      setConnectStatus({ ...connectStatus, error: true });
    });
    return () => api.disconnect();
  }, [api, connectStatus]);

  return (
    <EnvironmentContext.Provider
      value={{
        api,
        endpoint: _endpoint,
        setEndpoint,
        ...connectStatus
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};