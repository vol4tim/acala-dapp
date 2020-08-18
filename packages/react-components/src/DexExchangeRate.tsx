import React, { FC, memo, useState, useEffect } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18, calcTargetInBaseToOther, convertToFixed18, calcTargetInOtherToBase, calcTargetInOtherToOther } from '@acala-network/app-util';

import { FormatBalance } from '@acala-dapp/react-components';
import { useDexPool, useConstants } from '@acala-dapp/react-hooks';
import { tokenEq } from './utils';
import { DerivedDexPool } from '@acala-network/api-derive';

interface Props {
  supply: string | CurrencyId;
  target?: string | CurrencyId;
}

function convertPool (pool: DerivedDexPool): { base: Fixed18; other: Fixed18 } {
  return {
    base: convertToFixed18(pool.base),
    other: convertToFixed18(pool.other)
  };
}

export const DexExchangeRate: FC<Props> = memo(({ supply, target }) => {
  const { dexBaseCurrency } = useConstants();
  const _target = target || dexBaseCurrency;
  const supplyPool = useDexPool(supply || null as any as CurrencyId);
  const targetPool = useDexPool(_target || null as any as CurrencyId);
  const [ratio, setRatio] = useState<Fixed18>(Fixed18.ZERO);
  const [supplyToken, setSupplyToken] = useState<CurrencyId | string>();
  const [targetToken, setTargetToken] = useState<CurrencyId | string>(dexBaseCurrency);

  useEffect(() => {
    if (!supplyPool || !supply) {
      return;
    }

    if (tokenEq(supply, dexBaseCurrency) && !tokenEq(_target, dexBaseCurrency) && targetPool) {
      setRatio(calcTargetInBaseToOther(Fixed18.fromNatural(1), convertPool(targetPool), Fixed18.ZERO, Fixed18.ZERO));
      setSupplyToken(dexBaseCurrency);
      setTargetToken(_target);
    }

    if (tokenEq(_target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency) && supplyPool) {
      setRatio(calcTargetInOtherToBase(Fixed18.fromNatural(1), convertPool(supplyPool), Fixed18.ZERO, Fixed18.ZERO));
      setSupplyToken(supply);
      setTargetToken(dexBaseCurrency);
    }

    if (!tokenEq(_target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency) && supplyPool && targetPool) {
      setRatio(calcTargetInOtherToOther(Fixed18.fromNatural(1), convertPool(supplyPool), convertPool(targetPool), Fixed18.ZERO, Fixed18.ZERO));
      setSupplyToken(supply);
      setTargetToken(target || dexBaseCurrency);
    }
  }, [supplyPool, targetPool, supply, target, dexBaseCurrency, _target]);

  return (
    <FormatBalance
      pair={[
        {
          balance: 1,
          currency: supplyToken
        },
        {
          balance: ratio,
          currency: targetToken
        }
      ]}
      pairSymbol='≈'
    />
  );
});

DexExchangeRate.displayName = 'DexExchangeRate';
