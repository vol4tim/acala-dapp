import { useState, useEffect, useMemo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { PriceData } from '@acala-dapp/react-environment/RxStore/type';

import { useRxStore } from './useRxStore';

/**
 * @name useAllPrices
 * @description get all prices from the chain
 */
export const useAllPrices = (): PriceData[] => {
  const { price: priceStore } = useRxStore();
  const [prices, setPrices] = useState<PriceData[]>([]);

  useEffect(() => {
    const subscribe = priceStore.subscribe((result) => {
      if (!result) return;

      if (!result.length) return;

      setPrices(result);
    });

    return (): void => subscribe.unsubscribe();
  }, [priceStore, setPrices]);

  return prices;
};

/**
 * @name usePrice
 * @description get price of `currency`
 * @param currency
 */
export const usePrice = (currency?: CurrencyId): FixedPointNumber => {
  const prices = useAllPrices();
  const result = useMemo(() => {
    if (!currency) return FixedPointNumber.ZERO;

    // dex share should not have price
    if (currency.isDexShare) return FixedPointNumber.ZERO;

    const result = prices.find((item: PriceData): boolean => {
      return item.currency === currency.asToken.toString();
    });

    return result ? result.price : FixedPointNumber.ZERO;
  }, [prices, currency]);

  return result;
};
