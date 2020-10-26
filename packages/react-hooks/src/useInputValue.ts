import { useState, useRef, useEffect, Dispatch, SetStateAction, MutableRefObject, useCallback, useMemo } from 'react';
import { useMemorized } from './useMemorized';
import { get, set } from 'lodash';

interface Helper<T> {
  reset: () => void;
  ref: MutableRefObject<T>;
}

interface Options<T> {
  max?: (value: T) => Promise<T>;
  min?: (value: T) => Promise<T>;
}

type UseInputValueReturnType<T> = [
  T,
  (value: T) => void,
  Helper<T>
];

export const useInputValue = <T>(defaultValue: T, options?: Options<T>): UseInputValueReturnType<T> => {
  const [value, _setValue] = useState<T>(defaultValue);

  const _options = useMemorized(options);

  const ref = useRef<T>(value);

  const reset = useCallback(() => {
    _setValue(defaultValue);
  }, [_setValue, defaultValue]);

  const setValue = useCallback(async (value: T) => {
    if (_options && _options.max) {
      value = await _options.max(value);
    }

    if (_options && _options.min) {
      value = await _options.min(value);
    }

    // update ref
    ref.current = value;
    // update value
    _setValue(value);
  }, [_options, _setValue]);

  const helper = useMemo(() => {
    return {
      ref,
      reset
    };
  }, [ref, reset]);

  return [value, setValue, helper];
};
