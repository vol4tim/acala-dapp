import { Fixed18, convertToFixed18 } from '@acala-network/app-util';

import { useConstants } from './useConstants';
import { CurrencyLike, WithNull } from './types';
import { useAllPrices } from './priceHooks';
import { useApi } from './useApi';
import { useState, useEffect } from 'react';
import { combineLatest } from 'rxjs';
import { Balance } from '@acala-network/types/interfaces';
import { tokenEq } from '@acala-dapp/react-components';

interface SwapOverview {
  total: Fixed18;
  details: {
    currency: CurrencyLike;
    base: Fixed18;
    other: Fixed18;
    value: Fixed18;
  }[];
}

/**
 * @name useSwapOverview
 * @description query all dex token pairs information
 */
export const useSwapOverview = (): WithNull<SwapOverview> => {
  const { api } = useApi();
  const { dexCurrencies } = useConstants();
  const prices = useAllPrices();
  const [result, setResult] = useState<WithNull<SwapOverview>>(null);

  useEffect(() => {
    if (!api) return;

    combineLatest(dexCurrencies.map((item) => api.query.dex.liquidityPool<[Balance, Balance]>(item))).subscribe((result: [Balance, Balance][]): void => {
      const details = result.map((item, index) => {
        const currency = dexCurrencies[index];
        const price = prices.find((item) => tokenEq(currency, item.currency));
        const other = item[0] ? convertToFixed18(item[0]) : Fixed18.ZERO;
        const base = item[1] ? convertToFixed18(item[1]) : Fixed18.ZERO;
        const value = other.mul(price ? price.price : Fixed18.ZERO).add(base);

        return { base, currency, other, value };
      });

      const total = details.reduce((pre, cur) => pre.add(cur.value), Fixed18.ZERO);

      setResult({ details, total });
    });
  }, [api, dexCurrencies, prices]);

  return result;
};
