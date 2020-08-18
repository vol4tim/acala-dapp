import { FormikErrors } from 'formik';

import { ApiRx } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Amount } from '@acala-network/types/interfaces';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

import { useApi } from './useApi';
import { useAccounts } from './useAccounts';
import { CurrencyLike } from './types';
import { Observable } from 'rxjs';

interface BalanceConfig {
  type: 'balance';
  currency?: CurrencyLike;
  max?: number;
  min?: number;
}

interface NumberConfig {
  type: 'number';
  max?: number;
  min?: number;
  equalMax?: boolean;
  equalMin?: boolean;
}

interface StringConfig {
  type: 'string';
  pattern?: RegExp;
  max?: number;
  min?: number;
}

type Config = {
  [k in string]: BalanceConfig | NumberConfig | StringConfig;
}

export function getFormValidator<T> (config: Config, api: ApiRx, active: InjectedAccountWithMeta): (values: T) => void | object | Promise<FormikErrors<T>> {
  const numberPattern = /^([1-9]\d*|0)(\.\d*)?$/;

  return (values: any): void | object | Promise<FormikErrors<T>> => {
    const error = {} as any;

    return new Promise((resolve) => {
      Object.keys(values).forEach((key): void => {
        const _config = config[key];
        const value = values[key];

        if (_config.type === 'balance' && _config.currency) {
          const subscriber = ((api.derive as any).currencies.balance(active.address, _config.currency) as Observable<Amount>).subscribe((result: Amount) => {
            const _balance = convertToFixed18(result);
            const _value = Fixed18.fromNatural(value);
            const _max = Fixed18.fromNatural(_config.max !== undefined ? _config.max : Number.MAX_VALUE);
            const _min = Fixed18.fromNatural(_config.min !== undefined ? _config.min : 0);

            if (!numberPattern.test(value)) {
              error[key] = 'Not a valid number';
            }

            if (_value.isGreaterThan(_balance)) {
              error[key] = 'Balance is too low';
            }

            if (_value.isGreaterThan(_max)) {
              error[key] = `Value is bigger than ${_max.toNumber()}`;
            }

            if (_value.isLessThan(_min)) {
              error[key] = `Value is less than ${_min.toNumber()}`;
            }
          });

          subscriber.unsubscribe();
        }

        if (_config.type === 'number') {
          if (!numberPattern.test(value.toString())) {
            error[key] = 'Not a valid number';
          }

          if (_config.max !== undefined && value > _config.max) {
            error[key] = `Value is bigger than ${_config.max}`;
          }

          if (_config.min !== undefined && value < _config.min) {
            error[key] = `Value is less than ${_config.min}`;
          }

          if (_config.equalMax === false && value === _config.max) {
            error[key] = `Value should not equal ${_config.max}`;
          }

          if (_config.equalMin === false && value === _config.min) {
            error[key] = `Value should not equal ${_config.min}`;
          }
        }

        if (_config.type === 'string') {
          const length = (value as string).length;

          if (_config.pattern !== undefined && !_config.pattern.test(value)) {
            error[key] = 'Value is not a valid string';
          }

          if (_config.max !== undefined && length > _config.max) {
            error[key] = `Value's length is bigger than ${_config.max}`;
          }

          if (_config.min !== undefined && length < _config.min) {
            error[key] = `Value's length is less than ${_config.min}`;
          }
        }
      });

      resolve(error);
    });
  };
}

export function useFormValidator<T extends any> (_config: Config): (values: T) => void | object | Promise<FormikErrors<T>> {
  const { api } = useApi();
  const { active } = useAccounts();

  if (!active) {
    return (): object => ({ global: "can't get user address" });
  }

  return getFormValidator<T>(_config, api, active);
}
