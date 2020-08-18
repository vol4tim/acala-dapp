import { useMemo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18, convertToFixed18, calcTargetInOtherToBase } from '@acala-network/app-util';

import { useConstants } from './useConstants';
import { useDexPool } from './useDexPool';
import { tokenEq } from '@acala-dapp/react-components';

export const useDexExchangeRate = (supply: CurrencyId, target?: CurrencyId, supplyAmount = 0, targetAmount = 0): Fixed18 => {
  const { dexBaseCurrency } = useConstants();
  const _target = target || dexBaseCurrency;
  const supplyPool = useDexPool(supply || null as any as CurrencyId);
  const targetPool = useDexPool(_target || null as any as CurrencyId);
  const rate = useMemo<Fixed18>(() => {
    const _supplyAmount = Fixed18.fromNatural(supplyAmount || 0);
    const _targetAmount = Fixed18.fromNatural(targetAmount || 0);

    if (!supplyPool || !supply) {
      return Fixed18.ZERO;
    }

    // base -> other, use targetPool data, supply == base, target === other
    if (tokenEq(supply, dexBaseCurrency) && !tokenEq(_target, dexBaseCurrency) && targetPool) {
      const _other = convertToFixed18(targetPool.other);
      const _base = convertToFixed18(targetPool.base);

      return _other.sub(_targetAmount).div(_base.add(_supplyAmount));
    }

    // other -> base, use supplyPool data, supply === other, target === base
    if (tokenEq(_target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency) && supplyPool) {
      const _other = convertToFixed18(supplyPool.other);
      const _base = convertToFixed18(supplyPool.base);

      return _base.sub(_targetAmount).div(_other.add(_supplyAmount));
    }

    // other -> other, use supplyPool data & targetPool data, supply === supplyPool.other, target === targetPool.other
    if (!tokenEq(_target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency) && supplyPool && targetPool) {
      const _supplyOther = convertToFixed18(supplyPool.other);
      const _supplyBase = convertToFixed18(supplyPool.base);
      const _targetOther = convertToFixed18(targetPool.other);
      const _targetBase = convertToFixed18(targetPool.base);

      const target = calcTargetInOtherToBase(_supplyAmount, { base: _supplyBase, other: _supplyOther }, Fixed18.ZERO);

      if (!supplyAmount && !targetAmount) {
        return (_supplyBase.div(_supplyOther)).div(_targetBase.div(_targetOther));
      } else {
        return _supplyBase.sub(target).div(_supplyOther.add(_supplyAmount))
          .div(_targetBase.add(target).div(_targetOther.sub(_targetAmount)));
      }
    }

    return Fixed18.ZERO;
  }, [supply, supplyPool, targetPool, _target, dexBaseCurrency, supplyAmount, targetAmount]);

  return rate;
};
