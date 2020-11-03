import { useState, useRef, MutableRefObject, useCallback, useMemo, useEffect } from 'react';
import { ApiRx } from '@polkadot/api';
import { CurrencyId } from '@acala-network/types/interfaces';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { useMemorized } from './useMemorized';
import { useApi } from './useApi';

interface Instance<T> {
  reset: () => void;
  ref: MutableRefObject<T>;
  error?: string;
  setValidator: (validator: Options<T>['validator']) => void;
}

interface Options<T> {
  validator: (value: T) => Promise<void> | void;
}

type UseInputValueReturnType<T> = [
  T,
  (value: T) => void,
  Instance<T>
];

export const useInputValue = <T>(defaultValue: T, options?: Options<T>): UseInputValueReturnType<T> => {
  const _value = useMemorized(defaultValue);

  const [value, _setValue] = useState<T>(defaultValue);

  const _options = useMemorized(options);

  const validator = useRef<Options<T>['validator'] | undefined>(_options?.validator);

  const ref = useRef<T>(value);

  const [error, setError] = useState<string>();

  const reset = useCallback(() => {
    _setValue(defaultValue);
  }, [_setValue, defaultValue]);

  const setValidator = useCallback((newValidator: Options<T>['validator']) => {
    validator.current = newValidator;

    const promise = newValidator(value);

    promise
      ? promise
        .then(() => setError(''))
        .catch((e) => setError(e.message))
      : setError('');
  }, [validator, value]);

  const setValue = useCallback((value: T) => {
    // update ref
    ref.current = value;
    // update value
    _setValue(value);
  }, [_setValue]);

  const instance = useMemo(() => {
    return {
      error,
      ref,
      reset,
      setValidator
    };
  }, [ref, reset, error, setValidator]);

  useEffect(() => {
    if (!validator.current) return;

    const promise = validator.current(value);

    promise
      ? promise
        .then(() => setError(''))
        .catch((e) => setError(e.message))
      : setError('');
  }, [value, validator]);

  useEffect(() => {
    _setValue(_value);
  }, [_value]);

  return [value, setValue, instance];
};
