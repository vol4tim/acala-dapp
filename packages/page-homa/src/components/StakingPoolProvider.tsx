import React, { createContext, FC, memo, useMemo } from 'react';
import { useStakingPool } from '@acala-dapp/react-hooks';

type ContextData = {};

export const StakingPoolContext = createContext<ContextData>({} as ContextData);

export const StakingPoolProvider: FC = memo(({ children }) => {
  const result = useStakingPool();

  const contextData = useMemo(() => ({}), []);

  if (!result?.stakingPool) return null;

  return (
    <StakingPoolContext.Provider value={contextData}>
      {children}
    </StakingPoolContext.Provider>
  );
});

StakingPoolProvider.displayName = 'StakingPoolProvider';
