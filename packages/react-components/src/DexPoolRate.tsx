import React, { FC, useState, useEffect } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { FormatBalance } from '@acala-dapp/react-components';
import { useDexPool, useConstants } from '@acala-dapp/react-hooks';
import { tokenEq } from './utils';

interface Props {
  supply: string | CurrencyId;
  target?: string | CurrencyId;
}

export const DexPoolRate: FC<Props> = ({ supply, target }) => {
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
      setRatio(Fixed18.fromRational(
        targetPool.base.toString(),
        targetPool.other.toString()
      ));
      setSupplyToken(target);
      setTargetToken(dexBaseCurrency);
    }

    if (tokenEq(_target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency) && supplyPool) {
      setRatio(Fixed18.fromRational(
        supplyPool.base.toString(),
        supplyPool.other.toString()
      ));
      setSupplyToken(supply);
      setTargetToken(dexBaseCurrency);
    }

    if (!tokenEq(_target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency) && supplyPool && targetPool) {
      setRatio(Fixed18.fromRational(
        Fixed18.fromRational(
          supplyPool.base.toString(),
          supplyPool.other.toString()
        ).toNumber(),
        Fixed18.fromRational(
          targetPool.base.toString(),
          targetPool.other.toString()
        ).toNumber()
      ));
      setSupplyToken(supply);
      setTargetToken(target || dexBaseCurrency);
    }
  }, [supplyPool, targetPool, supply, target, dexBaseCurrency, _target]);

  return (
    <FormatBalance
      decimalLength={2}
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
      pairSymbol='='
    />
  );
};
