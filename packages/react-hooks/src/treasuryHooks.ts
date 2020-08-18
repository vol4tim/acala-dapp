import { useState, useEffect } from 'react';

import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { Balance } from '@acala-network/types/interfaces';

import { useCall } from './useCall';
import { CurrencyLike, WithNull } from './types';
import { useApi } from './useApi';
import { combineLatest } from 'rxjs';
import { useConstants } from './useConstants';

interface TreasuryOverview {
  debitPool: Fixed18;
  surplusPool: Fixed18;
  totalCollaterals: {
    currency: CurrencyLike;
    balance: Fixed18;
  }[];
}

export const useTreasuryOverview = (): WithNull<TreasuryOverview> => {
  const { api } = useApi();
  const { loanCurrencies } = useConstants();
  const _debitPool = useCall<Balance>('query.cdpTreasury.debitPool');
  const _surplusPool = useCall<Balance>('query.cdpTreasury.surplusPool');
  const [result, setResult] = useState<WithNull<TreasuryOverview>>(null);

  useEffect(() => {
    const subscriber = combineLatest(loanCurrencies.map((currency) => api.query.cdpTreasury.totalCollaterals<Balance>(currency))).subscribe((result) => {
      setResult({
        debitPool: convertToFixed18(_debitPool || 0),
        surplusPool: convertToFixed18(_surplusPool || 0),
        totalCollaterals: result ? result.map((item, index) => {
          return {
            balance: convertToFixed18(item || 0),
            currency: loanCurrencies[index]
          };
        }) : []
      });
    });

    return (): void => subscriber.unsubscribe();
  }, [_debitPool, _surplusPool, setResult, api.query.cdpTreasury, loanCurrencies]);

  return result;
};
