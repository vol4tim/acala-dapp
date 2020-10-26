/* eslint-disable */
import React, { createContext, FC, useEffect, useContext } from 'react';

import { Fixed18 } from '@acala-network/app-util';
import { useApi } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useApiQueryStore } from './modules/api-query';

type StoreData = {
  apiQueryStore: ReturnType<typeof useApiQueryStore>
};

const StoreContext = createContext<StoreData>({} as any);

export const StoreProvier: FC<BareProps> = ({ children }) => {
  const { api } = useApi();
  // const { state: pricesStore, setState: setPricesStore } = usePricesStore();
  const apiQueryStore = useApiQueryStore();

  useEffect(() => {
    // api.isReady && api.isReady.subscribe(() => {
    //   subscribePrice(api, () => {});
    // });
  }, [api]);

  if (!api) return null;

  return (
    <StoreContext.Provider value={{
      apiQueryStore
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export function useStore<T extends StoreData, K extends keyof T> (namespace: K): T[K] {
  const context = useContext(StoreContext) as T;

  return context[namespace];
}