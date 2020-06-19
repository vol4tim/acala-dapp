import { Balance } from '@acala-network/types/interfaces/runtime';

import { useAccounts } from './useAccounts';
import { useApi } from './useApi';
import { useState, useEffect } from 'react';
import { interval, Observable } from 'rxjs';
import { switchMap, map, startWith } from 'rxjs/operators';
import { Codec } from '@polkadot/types/types';

export function useCurrentRedeem (): { amount: Balance } | null {
  const { api } = useApi();
  const { active } = useAccounts();
  const [currentRedeem, setCurrentRedeem] = useState<{ amount: Balance } | null>(null);

  useEffect(() => {
    if (!api || !active) return;

    const subscriber = interval(1000 * 60).pipe(
      startWith(0),
      switchMap(() => (api.rpc as any).stakingPool.getAvailableUnbonded(active.address) as Observable<Codec>),
      map((result) => {
        if (result.isEmpty) return null;

        return result as unknown as { amount: Balance };
      })
    ).subscribe(setCurrentRedeem);

    return (): void => subscriber.unsubscribe();
  }, [api, active]);

  return currentRedeem;
}
