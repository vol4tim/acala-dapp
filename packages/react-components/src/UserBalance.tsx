import React, { FC } from 'react';

import AccountId from '@polkadot/types/generic/AccountId';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { Balance, CurrencyId } from '@acala-network/types/interfaces';

import { useCall, useAccounts, usePrice } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { FormatValue, FormatBalance } from './format';

interface Props extends BareProps {
  account?: AccountId | string;
  token?: CurrencyId;
  showValue?: boolean;
  showCurrencyName?: boolean;
}

export const UserBalance: FC<Props> = ({
  account,
  className,
  showCurrencyName = true,
  showValue = false,
  token
}) => {
  const { active } = useAccounts();
  const _account = account !== undefined ? account : active ? active.address : '';
  // FIXME: need fix api-derive type
  const result = useCall<Balance>('derive.currencies.balance', [_account, token]);
  const price = usePrice(token);

  if (!result) return null;

  if (showValue && price) {
    const _value = price.times(new FixedPointNumber(result.toString()));

    return (
      <FormatValue
        className={className}
        data={_value}
      />
    );
  }

  return (
    <FormatBalance
      balance={FixedPointNumber.fromInner(result.toString())}
      className={className}
      currency={showCurrencyName ? token : undefined}
    />
  );
};
