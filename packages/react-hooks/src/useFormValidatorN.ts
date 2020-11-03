import { FixedPointNumber } from '@acala-network/sdk-core';
import { getTokenName, isValidateAddress, BalanceInputValue } from '@acala-dapp/react-components';
import { CurrencyId, Balance } from '@acala-network/types/interfaces';

import { useBalance } from './balanceHooks';
import { useCallback, useEffect } from 'react';
import { useMemorized } from './useMemorized';

interface UseBalanceValidatorConfig {
  currency: CurrencyId;
  max?: [FixedPointNumber, string];
  min?: [FixedPointNumber, string];
  updateValidator?: (value: (value: BalanceInputValue) => Promise<any>) => void;
}

export const useBalanceValidator = (config: UseBalanceValidatorConfig): (value: BalanceInputValue) => Promise<any> => {
  const _config = useMemorized(config);
  const balance = useBalance(_config.currency);

  const fn = useCallback((value: BalanceInputValue): Promise<any> => {
    const _amount = new FixedPointNumber(value.amount);

    if (_amount.isZero()) return Promise.resolve();

    if (_config.max && _amount.isGreaterThan(_config.max[0])) {
      return Promise.reject(new Error(_config.max[1] ? _config.max[1] : `Greater than the max amount ${_config.max[0].toNumber()}`));
    }

    if (_config.min && _amount.isLessThan(_config.min[0])) {
      return Promise.reject(new Error(_config.min[1] ? _config.min[1] : `Less than The min amount ${_config.min[0].toNumber()}`));
    }

    if (_amount.isGreaterThan(balance)) {
      return Promise.reject(new Error(`Insufficient ${getTokenName(_config.currency)} balance`));
    }

    return Promise.resolve();
  }, [balance, _config]);

  useEffect(() => {
    if (_config.updateValidator) {
      _config.updateValidator(fn);
    }
  }, [fn, _config]);

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
