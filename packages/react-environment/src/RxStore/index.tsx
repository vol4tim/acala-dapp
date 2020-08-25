import React, { FC, createContext, useEffect, useState } from 'react';

import { BareProps } from '@acala-dapp/ui-components/types';
import { useApi } from '@acala-dapp/react-hooks';

import { StakingPoolStore } from './staking';
import { PriceStore } from './price';

export interface RxStoreData {
  price: PriceStore;
  stakingPool: StakingPoolStore;
}

export const RxStoreContext = createContext<RxStoreData>({} as RxStoreData);

export const RxStoreProvider: FC<BareProps> = ({ children }) => {
  const { api, connected } = useApi();
  const [store, setStore] = useState<RxStoreData>();

  useEffect(() => {
    if (!connected) return;

    const priceStore = new PriceStore();
    const stakingStore = new StakingPoolStore();

    stakingStore.init(api);
    priceStore.init(api, stakingStore.data$);

    setStore({
      price: priceStore,
      stakingPool: stakingStore
    });
  }, [api, connected]);

  if (!store) {
    return <>{children}</>;
  }

  return (
    <RxStoreContext.Provider value={store}>
      {children}
    </RxStoreContext.Provider>
  );
};
