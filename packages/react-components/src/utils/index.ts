import { Codec } from '@polkadot/types/types';
import * as dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';
import { ApiRx, ApiPromise } from '@polkadot/api';
import { TimestampedValue } from '@open-web3/orml-types/interfaces';

export * from './token';
export * from './account';

dayjs.extend(duration);

// works like toFixed but don't round, doesn't support scientific notation
export const padDecimalPlaces = (origin: number | string, dp: number): string => {
  const _origin = origin.toString();

  if (_origin.includes('e')) {
    return Number(origin).toFixed(dp);
  }

  let [i, d] = _origin.split('.');

  if (!d) {
    return i;
  }

  if (d) {
    d = d.length > dp ? d.slice(0, dp) : d.padEnd(dp, '0');
  }

  return [i, d].join('.');
};

export const effectiveDecimal = (origin: number | string, dp: number): string => {
  let _origin = origin.toString();

  // transfer scientific notation to number
  if (_origin.includes('e')) {
    _origin = Number(origin).toFixed(18).toString();
  }

  let [i, d] = _origin.split('.');

  if (!d) {
    d = ''.padEnd(dp, '0');
  } else {
    let count = dp;
    let ignoreZero = true;

    d = d.split('').reduce((acc, cur) => {
      ignoreZero = ignoreZero !== false && cur === '0';

      if (count <= 0) return acc;

      if (ignoreZero) return acc + cur;

      count -= 1;

      return acc + cur;
    }, '');
  }

  return [i, d].join('.');
};

export const thousand = (num: number): string => {
  return num.toLocaleString(undefined, { maximumSignificantDigits: 18, minimumFractionDigits: 5 });
};

export const formatHash = (hash: string): string => {
  return hash.replace(/(\w{6})\w*?(\w{6}$)/, '$1......$2');
};

export const formatBalance = (balance: Fixed18 | Codec | number | string | undefined): Fixed18 => {
  let inner = Fixed18.ZERO;

  if (!balance) {
    return Fixed18.ZERO;
  }

  if (typeof balance === 'number' || typeof balance === 'string') {
    inner = Fixed18.fromNatural(balance);
  } else if (balance instanceof Fixed18) {
    inner = balance;
  } else {
    inner = Fixed18.fromParts(balance.toString());
  }

  return inner;
};

export const numToFixed18Inner = (num: number | string): string => {
  return Fixed18.fromNatural(num).innerToString();
};

export const tokenEq = (base: CurrencyId | string, target: CurrencyId | string): boolean => {
  if (!target || !base) {
    return false;
  }

  return base.toString().toUpperCase() === target.toString().toUpperCase();
};

// FIXME: a trick to get value from TimestampedValue, need to fix
export const getValueFromTimestampValue = (origin: TimestampedValue): Codec => {
  if (origin && Reflect.has(origin.value, 'value')) {
    return (origin.value as any).value;
  }

  return origin.value;
};

export const getCurrencyIdFromName = (api: ApiRx | ApiPromise, name: string): CurrencyId => {
  const CurrencyId = api.registry.createClass('CurrencyId' as any);

  return new CurrencyId(api.registry, name);
};

export const formatDuration = (duration: number): number => {
  const DAY = 1000 * 60 * 60 * 24;

  return Fixed18.fromRational(duration, DAY).toNumber(6, 2);
};
