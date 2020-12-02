import React, { createContext, FC, useEffect, useContext } from 'react';

import { useApi } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useApiQueryStore } from './modules/api-query';
import { useOraclePrices } from './modules/oracle-price';
import { useUIConfig, UseUIConfigReturnType, UIData } from './modules/ui';

export type StoreData = {
  apiQueryStore: ReturnType<typeof useApiQueryStore>;
  oraclePrice: ReturnType<typeof useOraclePrices>;
  ui: UseUIConfigReturnType;
};

const StoreContext = createContext<StoreData>({} as any);

export const StoreProvier: FC<BareProps> = ({ children }) => {
  const { api } = useApi();
  // const { state: pricesStore, setState: setPricesStore } = usePricesStore();
  const apiQueryStore = useApiQueryStore();
  const oraclePrice = useOraclePrices();
  const ui = useUIConfig();

  useEffect(() => {
    // api.isReady && api.isReady.subscribe(() => {
    //   subscribePrice(api, () => {});
    // });
  }, [api]);

  if (!api) return null;

  return (
    <StoreContext.Provider value={{
      apiQueryStore,
      oraclePrice,
      ui
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export function useStore<T extends StoreData, K extends keyof T> (namespace: K): T[K] {
  const context = useContext(StoreContext) as T;

  return context[namespace];
}

export function usePageTitle (config: { content: string; breadcrumb?: UIData['breadcrumb'] }): void {
  const ui = useStore('ui');

  useEffect(() => {
    ui.setTitle(config);
  /* eslint-disable-next-line */
  }, []);
}
