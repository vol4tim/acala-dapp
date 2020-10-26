import React, { FC, memo } from 'react';
import AccountId from '@polkadot/types/generic/AccountId';
import { FormatBalance } from './format';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

interface Props {
  account?: AccountId | string;
  token: CurrencyLike;
}

export const DexReward: FC<Props> = memo(({
  account,
  token
}) => {
  return (
    <FormatBalance balance={0} />
  );
});

DexReward.displayName = 'DexRward';
