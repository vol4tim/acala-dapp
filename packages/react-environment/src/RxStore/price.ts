import { Observable, combineLatest, Subscription, interval } from 'rxjs';
import { map, shareReplay, startWith, mergeMap } from 'rxjs/operators';
import { ApiRx } from '@polkadot/api';

import { DerivedDexPool } from '@acala-network/api-derive';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { CurrencyId, OracleKey } from '@acala-network/types/interfaces';
import { TimestampedValue } from '@open-web3/orml-types/interfaces';

import { tokenEq } from '@acala-dapp/react-components';

import { BaseRxStore } from './base';
import { PriceData, StakingPoolData } from './type';

type SubscribeCallbackFN = (result: PriceData[]) => void;

function insertPrice (origin: PriceData[], currency: string, price: FixedPointNumber): void {
  const stored = origin.find((item) => item.currency === currency);

  if (stored) {
    stored.price = price;
  } else {
    origin.push({ currency, price });
  }
}

export class PriceStore extends BaseRxStore {
  private data$!: Observable<PriceData[]>;
  private stakingPool$!: Observable<StakingPoolData>;
  private api!: ApiRx;

  run (): void {
    const nativeCurrency = this.api.consts.currencies.nativeCurrencyId as unknown as CurrencyId;
    const aUSDCurrency = this.api.createType('CurrencyId' as any, { token: 'AUSD' });

    // get prices from oracle
    const allPrices$ = interval(1000 * 60)
      .pipe(
        startWith(0),
        mergeMap(() => (this.api.rpc as any).oracle.getAllValues('Aggregated'))
      ) as Observable<[[OracleKey, TimestampedValue]]>;
    // get native currnecy prices from dex
    const dex$ = (this.api.derive as any).dex.pool(nativeCurrency, aUSDCurrency) as Observable<DerivedDexPool>;

    this.data$ = combineLatest([allPrices$, this.stakingPool$, dex$]).pipe(
      map(([prices, pool, acaLP]): PriceData[] => {
        const exchangeRate = pool.stakingPool.liquidExchangeRate();

        const result = prices.map((item) => ({
          currency: item[0].asToken.toString(),
          price: FixedPointNumber.fromInner(((item[1] as unknown as TimestampedValue)?.value as any)?.value?.toString() || 0)
        }));

        const stakingCurrencyPrice = result.find((item) => tokenEq(item.currency, pool.derive.stakingCurrency));

        // calculate native currency price
        if (acaLP) {
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          const price = FixedPointNumber.fromInner(acaLP[0].toString()).div(FixedPointNumber.fromInner(acaLP[1].toString()));

          insertPrice(result, nativeCurrency.asToken.toString(), price);
        }

        // calculate and update liuquid currency price
        if (stakingCurrencyPrice && pool.stakingPool) {
          const currency = pool.derive.liquidCurrency;
          const price = stakingCurrencyPrice.price.times(exchangeRate);

          insertPrice(result, currency.asToken.toString(), price);
        }

        // insert ausd price as 1
        insertPrice(result, 'AUSD', FixedPointNumber.ONE);

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
