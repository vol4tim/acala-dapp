import { Codec } from '@polkadot/types/types';
import * as dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';
import { ApiRx, ApiPromise } from '@polkadot/api';
import { TimestampedValue } from '@open-web3/orml-types/interfaces';

export * from './token';
export * from './account';
export * from './formatter';

dayjs.extend(duration);

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

export const getCurrencyIdFromName = (api: ApiRx | ApiPromise, name: string): CurrencyId | string => {
  try {
    const CurrencyId = api.registry.createClass('CurrencyId' as any);

    return new CurrencyId(api.registry, name);
  } catch (e) {
    return name;
  }
};

export const eliminateGap = (target: Fixed18, max: Fixed18, gap: Fixed18): Fixed18 => {
  const _gap = target.sub(max);

  // target is larger than max, but not lerge enough
  if (_gap.isGreaterThan(Fixed18.ZERO) && _gap.isLessThan(gap)) {
    return max;
  }

  // target is smaller than max, but not small enough.
  if (_gap.isLessThan(Fixed18.ZERO) && _gap.negated().isLessThan(gap)) {
    return max;
  }

  return target;
};
