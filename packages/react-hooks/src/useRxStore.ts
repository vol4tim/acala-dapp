import { useContext } from 'react';
import { RxStoreContext, RxStoreData } from '@acala-dapp/react-environment';

export const useRxStore = (): RxStoreData => {
  return useContext(RxStoreContext);
};
