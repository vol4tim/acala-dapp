import React, { FC } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';

import { FormatBalance } from '@acala-dapp/react-components';
import { useDexPool, useConstants } from '@acala-dapp/react-hooks';

interface Props {
  token: string | CurrencyId;
}

export const DexPoolSize: FC<Props> = ({ token }) => {
  const { dexBaseCurrency } = useConstants();
  const pool = useDexPool(token);

  if (!pool) {
    return null;
  }

  return (
    <FormatBalance
      decimalLength={2}
      pair={[
        {
          balance: pool.other,
          currency: token
        },
        {
          balance: pool.base,
          currency: dexBaseCurrency
        }
      ]}
      pairSymbol='+'
    />
  );
};
