import React, { FC, memo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';

import { FormatBalance } from '@acala-dapp/react-components';
import { BareProps } from '@acala-dapp/ui-components/types';

import { useDexWithdrawShare } from './useDexWithdrawShare';

interface Props extends BareProps {
  token: CurrencyId;
  withdraw?: number;
}

export const AccountDexTokens: FC<Props> = memo(({
  className,
  token,
  withdraw
}) => {
  const result = useDexWithdrawShare(token, withdraw);

  return (
    <FormatBalance
      className={className}
      pair={result}
      pairSymbol='+'
    />
  );
});

AccountDexTokens.displayName = 'AccountDexTokens';
