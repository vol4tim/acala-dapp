import React, { FC, memo, useState, useEffect, useMemo, useCallback } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18, calcTargetInBaseToOther, convertToFixed18, calcTargetInOtherToBase, calcTargetInOtherToOther } from '@acala-network/app-util';
import { DerivedDexPool } from '@acala-network/api-derive';

import { FormatBalance } from '@acala-dapp/react-components';
import { SwapOutlined, Tag } from '@acala-dapp/ui-components';
import { useDexPool, useConstants } from '@acala-dapp/react-hooks';

import { tokenEq } from './utils';
import classes from './DexExchangeRate.module.scss';

interface Props {
  supply: string | CurrencyId;
  target?: string | CurrencyId;
  supplyAmount?: number;
}

function convertPool (pool: DerivedDexPool): { base: Fixed18; other: Fixed18 } {
  return {
    base: convertToFixed18(pool.base),
    other: convertToFixed18(pool.other)
  };
}

export const DexExchangeRate: FC<Props> = memo(({
  supply,
  supplyAmount = 1,
  target
}) => {
  const { dexBaseCurrency } = useConstants();
  const _target = useMemo(() => target || dexBaseCurrency, [dexBaseCurrency, target]);
  // ensue that _supplyAmount always not empty
  const _supplyAmount = useMemo(() => supplyAmount ? Fixed18.fromNatural(supplyAmount) : Fixed18.fromNatural(1), [supplyAmount]);
  const supplyPool = useDexPool(supply || null as any as CurrencyId);
  const targetPool = useDexPool(_target || null as any as CurrencyId);
  const [ratio, setRatio] = useState<Fixed18>(Fixed18.ZERO);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const handleSwapDirection = useCallback(() => {
    setDirection(direction === 'forward' ? 'back' : 'forward');
  }, [setDirection, direction]);

  useEffect(() => {
    if (!supplyPool || !supply) {
      return;
    }

    if (tokenEq(supply, dexBaseCurrency) && !tokenEq(_target, dexBaseCurrency) && targetPool) {
      setRatio(calcTargetInBaseToOther(_supplyAmount, convertPool(targetPool), Fixed18.ZERO, Fixed18.ZERO));
    }

    if (tokenEq(_target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency) && supplyPool) {
      setRatio(calcTargetInOtherToBase(_supplyAmount, convertPool(supplyPool), Fixed18.ZERO, Fixed18.ZERO));
    }

    if (!tokenEq(_target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency) && supplyPool && targetPool) {
      setRatio(calcTargetInOtherToOther(_supplyAmount, convertPool(supplyPool), convertPool(targetPool), Fixed18.ZERO, Fixed18.ZERO));
    }
  }, [supplyPool, targetPool, supply, _target, dexBaseCurrency, _supplyAmount]);

  return (
    <div className={classes.root}>
      <FormatBalance
        pair={
          direction === 'forward' ? [
            {
              balance: 1,
              currency: supply
            },
            {
              balance: ratio.div(_supplyAmount),
              currency: _target
            }
          ] : [
            {
              balance: 1,
              currency: _target
            },
            {
              balance: _supplyAmount.div(ratio),
              currency: supply
            }
          ]
        }
        pairSymbol='≈'
      />
      <Tag
        className={classes.swap}
        onClick={handleSwapDirection}
      >
        <SwapOutlined />
      </Tag>
    </div>
  );
});

DexExchangeRate.displayName = 'DexExchangeRate';
