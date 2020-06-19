import React, { createContext, FC, memo, useState, useEffect } from 'react';
import { useStakingPool, UseStakingPoolReturnType, useInitialize } from '@acala-dapp/react-hooks';
import { PageLoading } from '@acala-dapp/ui-components';

export type ACTION_TYPE = 'staking' | 'redeem';

export interface ContextData extends UseStakingPoolReturnType {
  action: ACTION_TYPE;
  setAction: (type: ACTION_TYPE) => void;
}

export const StakingPoolContext = createContext<ContextData>({} as ContextData);

export const StakingPoolProvider: FC = memo(({ children }) => {
  const [action, setAction] = useState<ACTION_TYPE>('staking');
  const result = useStakingPool();
  const { isInitialized, setEnd } = useInitialize();

  useEffect(() => {
    if (!result) return;

    if (result.stakingPool) {
      setEnd();
    }
  }, [result, setEnd]);

  return (
    <StakingPoolContext.Provider value={{ ...result, action, setAction }}>
      {isInitialized ? children : <PageLoading />}
    </StakingPoolContext.Provider>
  );
});

StakingPoolProvider.displayName = 'StakingPoolProvider';
