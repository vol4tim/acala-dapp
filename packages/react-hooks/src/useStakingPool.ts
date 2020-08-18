import { useState, useEffect, useCallback, useMemo } from 'react';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DerivedStakingPool } from '@acala-network/api-derive';
import { StakingPoolHelper, Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { Amount, Rate, BlockNumber, Balance } from '@acala-network/types/interfaces';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { useAccounts } from './useAccounts';
import { useRxStore } from './useRxStore';

export interface FreeItem {
  era: number;
  free: Fixed18;
}

export interface RedeemItem {
  era: number;
  balance: Fixed18;
}

export interface UseStakingPoolReturnType {
  stakingPool: DerivedStakingPool | undefined;
  stakingPoolHelper: StakingPoolHelper | undefined;
  unbondingDuration: number;
  eraDuration: number;
  freeList: FreeItem[];
  rewardRate: Rate | undefined;
  redeemList: RedeemItem[];
}

export const useStakingPool = (): UseStakingPoolReturnType => {
  const { api } = useApi();
  const { active } = useAccounts();
  const [stakingPoolHelper, setStakingPoolHelper] = useState<StakingPoolHelper | undefined>();
  const [stakingPool, setStakingPool] = useState<DerivedStakingPool | undefined>();
  const { stakingPool: stakingPoolStore } = useRxStore();
  const rewardRate = useCall<Rate>('query.polkadotBridge.mockRewardRate', []);

  const [freeList, setFreeList] = useState<FreeItem[]>([]);
  const [redeemList, setRedeemList] = useState<RedeemItem[]>([]);

  const unbondingDuration = useMemo<number>(() => {
    if (!api || !stakingPool) {
      return 0;
    }

    const eraLength = api.consts.polkadotBridge.eraLength as unknown as BlockNumber;
    const expectedBlockTime = api.consts.babe.expectedBlockTime;

    return expectedBlockTime.toNumber() * eraLength.toNumber() * stakingPool.bondingDuration.toNumber();
  }, [api, stakingPool]);

  const eraDuration = useMemo<number>(() => {
    if (!api) {
      return 0;
    }

    const eraLength = api.consts.polkadotBridge.eraLength as unknown as BlockNumber;
    const expectedBlockTime = api.consts.babe.expectedBlockTime;

    return expectedBlockTime.toNumber() * eraLength.toNumber();
  }, [api]);

  const fetchFreeList = useCallback((start: number, duration: number): Observable<{ era: number; free: Fixed18}[]> => {
    const eraArray = new Array(duration).fill(undefined).map((_i, index) => start + index);

    return combineLatest(
      eraArray.map((duration: number) => api.query.stakingPool.unbonding<Amount[]>(duration))
    ).pipe(
      map((result) => eraArray.map((era, index) => {
        const free = Fixed18.fromParts(result[index][0].toString()).sub(Fixed18.fromParts(result[index][1].toString()));

        return { era, free };
      })),
      map((result) => result.filter((item): boolean => !item.free.isZero()))
    );
  }, [api]);

  const fetchRedeemList = useCallback((): Observable<{ era: number; balance: Fixed18}[]> => {
    if (!stakingPool || !active) {
      return of([]);
    }

    const duration = stakingPool.bondingDuration.toNumber();
    const start = stakingPool.currentEra.toNumber();
    const eraArray = new Array(duration).fill(undefined).map((_i, index) => start + index + 2);

    return combineLatest(
      eraArray.map((era: number) => api.query.stakingPool.claimedUnbond<Balance>(active.address, era))
    ).pipe(
      map((result) => eraArray.map((era, index) => ({
        balance: result[index].isEmpty ? Fixed18.ZERO : convertToFixed18(result[index]),
        era
      }))),
      map((result) => result.filter((item): boolean => !item.balance.isZero()))
    );
  }, [stakingPool, active, api.query.stakingPool]);

  useEffect(() => {
    const subscriber = fetchRedeemList().subscribe(setRedeemList);

    return (): void => subscriber.unsubscribe();
  }, [fetchRedeemList, setRedeemList]);

  useEffect(() => {
    if (!stakingPool) return;

    const subscriber = fetchFreeList(
      stakingPool.currentEra.toNumber() + 1,
      stakingPool.bondingDuration.toNumber()
    ).subscribe(setFreeList);

    return (): void => subscriber.unsubscribe();
  }, [fetchFreeList, stakingPool]);

  useEffect(() => {
    const subscribe = stakingPoolStore.subscribe((result) => {
      setStakingPoolHelper(result.helper);
      setStakingPool(result.stakingPool);
    });

    return (): void => subscribe.unsubscribe();
  }, [stakingPoolStore, setStakingPool, setStakingPoolHelper]);

  return {
    eraDuration,
    freeList,
    redeemList,
    rewardRate,
    stakingPool,
    stakingPoolHelper,
    unbondingDuration
  };
};
