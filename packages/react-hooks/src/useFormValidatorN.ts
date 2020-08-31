import { FormikErrors } from 'formik';
import { useMemo } from 'react';

import { ApiRx } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Fixed18 } from '@acala-network/app-util';
import { tokenEq, getTokenName } from '@acala-dapp/react-components';

import { useApi } from './useApi';
import { useAccounts } from './useAccounts';
import { CurrencyLike } from './types';
import { useAllBalances, BalanceData, useBalance } from './balanceHooks';

interface UseBalanceValidatorConfig {
  currency: CurrencyLike;
  fieldName: string;
  getFieldValue: any;
}

export const useBalanceValidator = (config: UseBalanceValidatorConfig): () => Promise<any> => {
  const balance = useBalance(config.currency);

  return (): Promise<any> => {
    const value = config.getFieldValue(config.fieldName);

    if (Fixed18.fromNatural(value).isGreaterThan(balance)) {
      console.log('error');

      return Promise.reject(new Error(`Insufficient ${getTokenName(config.currency)} Balance`));
    }

    return Promise.resolve();
  };
};
