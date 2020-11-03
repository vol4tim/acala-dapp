import { FixedPointNumber } from '@acala-network/sdk-core';
import { getTokenName, isValidateAddress, BalanceInputValue } from '@acala-dapp/react-components';
import { CurrencyId, Balance } from '@acala-network/types/interfaces';

import { useBalance } from './balanceHooks';
import { useCallback } from 'react';
import { useMemorized } from './useMemorized';

interface UseBalanceValidatorConfig {
  currency: CurrencyId;
}

export const useBalanceValidator = (config: UseBalanceValidatorConfig): (value: BalanceInputValue) => Promise<any> => {
  const _config = useMemorized(config);
  const balance = useBalance(_config.currency);

  const fn = useCallback((value: BalanceInputValue): Promise<any> => {
    if (new FixedPointNumber(value.amount).isGreaterThan(balance)) {
      return Promise.reject(new Error(`Insufficient ${getTokenName(_config.currency)} Balance`));
    }

    return Promise.resolve();
  }, [balance, _config]);

  return fn;
};

interface UseAddressValidatorConfig {
  required?: boolean;
  fieldName: string;
  getFieldVaule: any;
}

export const useAddressValidator = (config: UseAddressValidatorConfig): () => Promise<any> => {
  return (): Promise<any> => {
    const value = config.getFieldVaule(config.fieldName);

    if (config.required && !value) {
      return Promise.reject(new Error('Address is Required'));
    }

    const result = isValidateAddress(value);

    if (!result) {
      return Promise.reject(new Error('Invalid Address'));
    }

    return Promise.resolve();
  };
};
