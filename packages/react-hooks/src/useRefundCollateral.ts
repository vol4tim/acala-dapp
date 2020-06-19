import { combineLatest, Observable } from 'rxjs';

import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { Balance } from '@open-web3/orml-types/interfaces';

import { CurrencyLike } from './types';
import { useConstants } from './useConstants';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useCall } from './useCall';
import { useApi } from './useApi';

export interface RefundCollaterals {
  [k: string]: Fixed18;
}

interface HooksReturnType {
  collaterals: RefundCollaterals;
  calcCanReceive: (amount: Fixed18) => RefundCollaterals;
}

export const useRefundCollateral = (): HooksReturnType => {
  const { api } = useApi();
  const { loanCurrencies, stableCurrency } = useConstants();
  const [collaterals, setCollaterals] = useState<RefundCollaterals>({} as RefundCollaterals);
  const _collaterals = useRef<RefundCollaterals>({} as RefundCollaterals);
  const totalIssuance = useCall<Balance>('query.tokens.totalIssuance', [stableCurrency]);

  const calcCanReceive = useCallback((amount: Fixed18): RefundCollaterals => {
    if (!totalIssuance) {
      return {};
    }

    const ratio = amount.div(convertToFixed18(totalIssuance));
    const _result: RefundCollaterals = {};

    Object.keys(_collaterals.current).map((currency: string): void => {
      _result[currency] = _collaterals.current[currency].mul(ratio);
    });

    return _result;
  }, [totalIssuance]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const subscriber = combineLatest(loanCurrencies.map(
      (currency: CurrencyLike): Observable<Balance> => api.query.cdpTreasury.totalCollaterals<Balance>(currency)
    )).subscribe((result: Balance[]) => {
      setCollaterals(loanCurrencies.reduce<RefundCollaterals>((acc, cur: CurrencyLike, index) => {
        acc[cur.toString()] = convertToFixed18(result[index]);

        return acc;
      }, {}));
    });

    return (): void => subscriber.unsubscribe();
  }, [api, collaterals, loanCurrencies]);

  return {
    calcCanReceive,
    collaterals
  };
};
