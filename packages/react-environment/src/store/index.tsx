import React, { createContext, FC, useEffect, useContext, useMemo } from 'react';

import { useApi, useMemorized } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useApiQueryStore } from './modules/api-query';
import { useOraclePricesStore } from './modules/oracle-prices';
import { useUIConfig, UseUIConfigReturnType, UIData } from './modules/ui';
import { useStakingStore, StakingPoolData } from './modules/staking';
import { usePricesStore, PriceData } from './modules/prices';

export type {
  StakingPoolData,
  PriceData
};

export type StoreData = {
  apiQuery: ReturnType<typeof useApiQueryStore>;
  oraclePrices: ReturnType<typeof useOraclePricesStore>;
  prices: ReturnType<typeof usePricesStore>;
  staking: ReturnType<typeof useStakingStore>;
  ui: UseUIConfigReturnType;
};

const StoreContext = createContext<StoreData>({} as any);

export const StoreProvier: FC<BareProps> = ({ children }) => {
  const { api } = useApi();
  const apiQuery = useApiQueryStore();
  const oraclePrices = useOraclePricesStore();
  const ui = useUIConfig();
  const staking = useStakingStore();
  const prices = usePricesStore();

  const data = useMemo(() => ({
    apiQuery,
    oraclePrices,
    prices,
    staking,
    ui
  }), [apiQuery, oraclePrices, prices, ui, staking]);

  if (!api) return null;

  return (
    <StoreContext.Provider value={data}>
      {children}
    </StoreContext.Provider>
  );
};

export function useStore<T extends StoreData, K extends keyof T> (namespace: K): T[K] {
  const context = useContext(StoreContext) as T;

  return context[namespace];
}

export function usePageTitle (config: { content: string; breadcrumb?: UIData['breadcrumb'] }): void {
  const _config = useMemorized(config);
  const ui = useStore('ui');

  useEffect(() => {
    ui.setTitle(_config);
  /* eslint-disable-next-line */
  }, [_config]);
}
