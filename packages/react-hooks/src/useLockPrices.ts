import { useState, useEffect, useMemo } from 'react';
import { combineLatest } from 'rxjs';
import { Option } from '@polkadot/types';

import { Price } from '@open-web3/orml-types/interfaces';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

import { tokenEq } from '@acala-dapp/react-components';

import { useApi } from './useApi';
import { useStakingPool } from './useStakingPool';
import { CurrencyLike } from './types';

export type LockedPricesResult = { [k: string]: Fixed18 };

export function useLockPrices (): LockedPricesResult {
  const { api } = useApi();
  const oracleCurrencies = useMemo(() => ['DOT', 'XBTC', 'RENBTC'], []);
  const [prices, setPrices] = useState<LockedPricesResult>({});
  const { stakingPool, stakingPoolHelper } = useStakingPool();

  useEffect(() => {
    if (!api || !oracleCurrencies || !stakingPool || !stakingPoolHelper) {
      return;
    }

    const subscriber = combineLatest(oracleCurrencies.map((currency: CurrencyLike) => api.query.prices.lockedPrice<Option<Price>>(currency as string)))
      .subscribe((result: Option<Price>[]): void => {
        const priceList: LockedPricesResult = {};

        result.forEach((price: Option<Price>, index: number): void => {
          priceList[oracleCurrencies[index].toString()] = convertToFixed18(price);

          if (tokenEq(oracleCurrencies[index], stakingPool.stakingCurrency)) {
            const exchangeRate = stakingPoolHelper.liquidExchangeRate;
            const liquidPrice = convertToFixed18(price).mul(exchangeRate);

            priceList[stakingPool.liquidCurrency.toString()] = liquidPrice;
          }
        });
        setPrices(priceList);
      });

    return (): void => subscriber.unsubscribe();
  }, [api, oracleCurrencies, stakingPool, stakingPoolHelper]);

  return prices;
}
