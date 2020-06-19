import React, { FC, memo } from 'react';

import AccountId from '@polkadot/types/generic/AccountId';
import { CurrencyId, Balance } from '@acala-network/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';

import { useCall, useAccounts, usePrice } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { FormatFixed18, FormatBalance } from './format';

interface Props extends BareProps {
  account?: AccountId | string;
  token: CurrencyId | string;
  withPrice?: boolean;
  withIcon?: boolean;
}

export const UserBalance: FC<Props> = memo(({
  account,
  className,
  token,
  withIcon = true,
  withPrice = false
}) => {
  const { active } = useAccounts();
  const _account = account !== undefined ? account : active ? active.address : '';
  // FIXME: need fix api-derive type
  const result = useCall<Balance>('derive.currencies.balance', [_account, token]);
  const price = usePrice(token);

  if (!result || !price) {
    return null;
  }

  if (withPrice) {
    const _amount = price.mul(convertToFixed18(result));

    return (
      <FormatFixed18
        className={className}
        data={_amount}
        format='thousand'
        prefix='$'
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
