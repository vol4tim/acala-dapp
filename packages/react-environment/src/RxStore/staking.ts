import { BaseRxStore } from './base';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiRx } from '@polkadot/api';

import { DerivedStakingPool } from '@acala-network/api-derive';
import { StakingPool } from '@acala-network/sdk-homa';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { StakingPoolData } from './type';

type SubscribeCallbackFN = (data: StakingPoolData) => void;

export class StakingPoolStore extends BaseRxStore {
  public data$!: Observable<StakingPoolData>;
  private api!: ApiRx;

  init (api: ApiRx): void{
    this.api = api;
    this.run();
  }

  run (): void {
    const stakingPool$ = (this.api.derive as any).homa.stakingPool() as Observable<DerivedStakingPool>;

    this.data$ = stakingPool$.pipe(
      map((data: DerivedStakingPool): StakingPoolData => {
        const stakingPool = new StakingPool({
          bondingDuration: data.bondingDuration.toNumber(),
          currentEra: data.currentEra.toNumber(),
          defaultExchangeRate: FixedPointNumber.fromInner(data.defaultExchangeRate.toString()),
          freeUnbonded: FixedPointNumber.fromInner(data.freeUnbonded.toString()),
          liquidTotalIssuance: FixedPointNumber.fromInner(data.liquidTokenIssuance.toString()),
          stakingPoolParams: {
            baseFeeRate: FixedPointNumber.fromInner(data.stakingPoolParams.baseFeeRate.toString()),
            targetMaxFreeUnbondedRatio: FixedPointNumber.fromInner(data.stakingPoolParams.targetMaxFreeUnbondedRatio.toString()),
            targetMinFreeUnbondedRatio: FixedPointNumber.fromInner(data.stakingPoolParams.targetMinFreeUnbondedRatio.toString()),
            targetUnbondingToFreeRatio: FixedPointNumber.fromInner(data.stakingPoolParams.targetUnbondingToFreeRatio.toString())
          },
          totalBonded: FixedPointNumber.fromInner(data.totalBonded.toString()),
          unbondNextEra: FixedPointNumber.fromInner(data.nextEraUnbond[0].toString()),
          unbondingToFree: FixedPointNumber.fromInner(data.unbondingToFree.toString())
        });

        return {
          derive: data,
          stakingPool: stakingPool
        };
      }),
      shareReplay(1)
    );

    this.isInitialized = true;
  }

  subscribe (callback: SubscribeCallbackFN): Subscription {
    return this.data$.subscribe(callback);
  }
}
