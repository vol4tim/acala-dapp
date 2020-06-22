import { Observable, combineLatest, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiRx } from '@polkadot/api';

import { DerivedPrice, DerivedDexPool } from '@acala-network/api-derive';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';
import { CurrencyId } from '@acala-network/types/interfaces';

import { BaseRxStore } from './base';
import { PriceData, StakingPoolWithHelper } from './type';
import { tokenEq, getValueFromTimestampValue } from '../utils';

type SubscribeCallbackFN = (result: PriceData[]) => void;

export class PriceStore extends BaseRxStore {
  private data$!: Observable<PriceData[]>;
  private stakingPool$!: Observable<StakingPoolWithHelper>;
  private api!: ApiRx;

  run (): void {
    const nativeCurrency = this.api.consts.currencies.nativeCurrencyId as unknown as CurrencyId;
    const allPrices$ = (this.api.derive as any).price.allPrices() as Observable<DerivedPrice[]>;
    const dex$ = (this.api.derive as any).dex.pool(nativeCurrency) as Observable<DerivedDexPool>;

    this.data$ = combineLatest([allPrices$, this.stakingPool$, dex$]).pipe(
      map(([prices, pool, nativeCurrencyDex]): PriceData[] => {
        const exchangeRate = pool.helper.liquidExchangeRate;

        const stakingCurrencyPrice = prices.find((item) =>
          tokenEq(item.token, pool.stakingPool.stakingCurrency)
        );

        const result = prices.map((item: DerivedPrice) => ({
          currency: item.token,
          price: convertToFixed18(getValueFromTimestampValue(item.price))
        }));

        // calculate native currency price
        if (nativeCurrencyDex) {
          const price = convertToFixed18(nativeCurrencyDex.base).div(convertToFixed18(nativeCurrencyDex.other));
          const _p = result.find((item: PriceData): boolean => tokenEq(item.currency, nativeCurrency));

          if (_p) {
            _p.price = price;
          } else {
            result.push({ currency: nativeCurrency.toString(), price });
          }
        }

        // calculate and update liuquid currency price
        if (stakingCurrencyPrice && pool.stakingPool) {
          const currency = pool.stakingPool.liquidCurrency;
          const price = convertToFixed18(getValueFromTimestampValue(stakingCurrencyPrice.price))
            .mul(exchangeRate)
            .max(Fixed18.ZERO);
          const _p = result.find((item: PriceData): boolean => tokenEq(item.currency, currency));

          if (_p) {
            _p.price = price;
          } else {
            result.push({ currency: currency.toString(), price });
          }
        }

        return result;
      }),
      shareReplay(1)
    );
  }

  init (api: ApiRx, stakingPool$: Observable<StakingPoolWithHelper>): void {
    this.stakingPool$ = stakingPool$;
    this.api = api;
    this.run();
  }

  subscribe (callback: SubscribeCallbackFN): Subscription {
    return this.data$.subscribe(callback);
  }
}
