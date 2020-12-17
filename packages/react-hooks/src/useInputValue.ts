import { useState, useRef, MutableRefObject, useCallback, useMemo, useEffect, useLayoutEffect } from 'react';
import { useMemorized } from './useMemorized';

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
  (value: Partial<T>) => void,
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

  const setValue = useCallback((value: Partial<T>) => {
    const _value = {
      ...ref.current,
      ...value
    };

    // update ref
    ref.current = _value;
    // update value
    _setValue(_value);
  }, [_setValue]);

  const instance = useMemo(() => {
    return {
      error,
      ref,
      reset,
      setValidator
    };
  }, [ref, reset, error, setValidator]);

  useLayoutEffect(() => {
    if (!validator.current) return;

    const _validator = validator.current(value);

    _validator
      ? _validator
        .then(() => setError(''))
        .catch((e) => setError(e.message))
      : setError('');
  }, [value, validator]);

  useEffect(() => {
    _setValue(_value);
  }, [_value]);

  return useMemo(() => [value, setValue, instance], [value, setValue, instance]);
};
