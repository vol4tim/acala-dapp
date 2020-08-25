import { BaseRxStore } from './base';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiRx } from '@polkadot/api';

import { DerivedStakingPool } from '@acala-network/api-derive';
import { StakingPoolHelper } from '@acala-network/app-util';

import { StakingPoolWithHelper } from './type';

type SubscribeCallbackFN = (data: StakingPoolWithHelper) => void;

export class StakingPoolStore extends BaseRxStore {
  public data$!: Observable<StakingPoolWithHelper>;
  private api!: ApiRx;

  init (api: ApiRx): void{
    this.api = api;
    this.run();
  }

  run (): void {
    const stakingPool$ = (this.api.derive as any).homa.stakingPool() as Observable<DerivedStakingPool>;

    this.data$ = stakingPool$.pipe(
      map((stakingPool: DerivedStakingPool): StakingPoolWithHelper => {
        const helper = new StakingPoolHelper({
          bondingDuration: stakingPool.bondingDuration,
          communalFree: stakingPool.freeUnbonded,
          currentEra: stakingPool.currentEra,
          defaultExchangeRate: stakingPool.defaultExchangeRate,
          liquidTokenIssuance: stakingPool.liquidTokenIssuance,
          maxClaimFee: stakingPool.maxClaimFee,
          nextEraClaimedUnbonded: stakingPool.nextEraUnbond[1],
          totalBonded: stakingPool.totalBonded,
          unbondingToFree: stakingPool.unbondingToFree
        });

        return { helper, stakingPool };
      }),
      shareReplay(1)
    );

    this.isInitialized = true;
  }

  subscribe (callback: SubscribeCallbackFN): Subscription {
    return this.data$.subscribe(callback);
  }
}
