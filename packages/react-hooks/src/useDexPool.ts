import { useCall } from './useCall';

import { DerivedDexPool } from '@acala-network/api-derive';
import { CurrencyLike } from './types';

export const useDexPool = (token: CurrencyLike): DerivedDexPool | undefined => {
  const pool = useCall<DerivedDexPool>('derive.dex.pool', [token]);

  return pool;
};
