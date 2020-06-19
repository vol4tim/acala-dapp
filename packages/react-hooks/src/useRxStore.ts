import { useContext } from 'react';
import { RxStoreContext, RxStoreData } from '@acala-dapp/react-components/RxStore';

export const useRxStore = (): RxStoreData => {
  return useContext(RxStoreContext);
};
