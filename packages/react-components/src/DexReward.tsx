import React, { FC, memo } from 'react';
import AccountId from '@polkadot/types/generic/AccountId';
import { useDexReward } from '@acala-dapp/react-hooks';
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
  const reward = useDexReward(token, account);

  return (
    <FormatBalance
      balance={reward.amount}
      currency={reward.token}
    />
  );
});

DexReward.displayName = 'DexRward';
