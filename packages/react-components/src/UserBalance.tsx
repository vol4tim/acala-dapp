import React, { FC, memo } from 'react';

import AccountId from '@polkadot/types/generic/AccountId';
import { Balance } from '@acala-network/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';

import { useCall, useAccounts, usePrice } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { FormatValue, FormatBalance } from './format';

interface Props extends BareProps {
  account?: AccountId | string;
  token: CurrencyLike;
  showValue?: boolean;
  withIcon?: boolean;
}

export const UserBalance: FC<Props> = memo(({
  account,
  className,
  showValue = false,
  token,
  withIcon = true
}) => {
  const { active } = useAccounts();
  const _account = account !== undefined ? account : active ? active.address : '';
  // FIXME: need fix api-derive type
  const result = useCall<Balance>('derive.currencies.balance', [_account, token]);
  const price = usePrice(token);

  if (!result || !price) {
    return null;
  }

  if (showValue) {
    const _value = price.mul(convertToFixed18(result));

    return (
      <FormatValue
        className={className}
        data={_value}
      />
    );
  }

  return (
    <FormatBalance
      balance={convertToFixed18(result)}
      className={className}
      currency={withIcon ? token : ''}
    />
  );
});

UserBalance.displayName = 'UserBalance';
