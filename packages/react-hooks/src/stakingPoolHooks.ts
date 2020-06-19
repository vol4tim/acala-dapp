import { useEffect, useState } from 'react';

import { StakingPoolWithHelper } from '@acala-dapp/react-components/RxStore/type';

import { useRxStore } from './useRxStore';

export const useStakingPool = (): StakingPoolWithHelper | undefined => {
  const { stakingPool: stakingPoolStore } = useRxStore();
  const [state, setState] = useState<StakingPoolWithHelper>();

  useEffect(() => {
    const subscribe = stakingPoolStore.subscribe(setState);

    return (): void => stakingPoolStore.unsubscribe(subscribe);
  }, [setState, stakingPoolStore]);

  return state;
};
