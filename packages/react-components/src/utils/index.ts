import * as dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';
import { FixedPointNumber } from '@acala-network/sdk-core';

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

  try {
    // convert tokenSymbo to stirng
    if (typeof base !== 'string') {
      base = base.isToken ? base.asToken.toString() : base.asDexShare.toString();
    }

    // convert tokenSymbo to stirng
    if (typeof target !== 'string') {
      target = target.isToken ? target.asToken.toString() : target.asDexShare.toString();
    }

    return base === target;
  } catch (e) {
    // swallow error
  }

  return false;
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

export const focusToFixed18 = (origin: Fixed18 | FixedPointNumber): Fixed18 => {
  if (origin instanceof FixedPointNumber) {
    return Fixed18.fromParts(origin.toChainData());
  }

  return origin;
};

export const focusToFixedPointNumber = (origin: Fixed18 | FixedPointNumber): FixedPointNumber => {
  if (origin instanceof Fixed18) {
    return FixedPointNumber._fromBN(origin.getInner());
  }

  return origin;
};
