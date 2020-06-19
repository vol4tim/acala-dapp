import React, { FC } from 'react';

import AccountId from '@polkadot/types/generic/AccountId';
import { CurrencyId } from '@acala-network/types/interfaces';

import { useBalance, useAmount, useTotalAmount } from '@acala-dapp/react-hooks';

import { FormatBalance, FormatFixed18, FormatFixed18Props, FormatBalanceProps } from './format';
import { AccountLike, CurrencyLike } from '@acala-dapp/react-hooks/types';

interface AssetBalanceProps extends FormatBalanceProps {
  account?: AccountLike;
  currency: CurrencyLike;
  showCurrency?: boolean;
}

/**
 * @name AssetBalance
 * @description display user asset balance
 */
export const AssetBalance: FC<AssetBalanceProps> = ({ account, currency, showCurrency, ...other }) => {
  const balance = useBalance(currency, account);

  if (!balance) {
    return null;
  }

  return (
    <FormatBalance
      balance={balance}
      currency={showCurrency ? currency : undefined}
      {...other}
    />
  );
};

interface AssetAmountProps extends FormatFixed18Props{
  account?: AccountId | string;
  currency: CurrencyId | string;
}

/**
 * @name AssetAmount
 * @description display user asset amount in USD
 */
export const AssetAmount: FC<AssetAmountProps> = ({
  account,
  currency,
  prefix = '≈ US $',
  ...other
}) => {
  const amount = useAmount(currency, account);

  if (!amount) {
    return null;
  }

  return (
    <FormatFixed18
      data={amount}
      prefix={prefix}
      {...other}
    />
  );
};

export interface TotalAssetAmountProps extends FormatFixed18Props {
  account?: AccountId | string;
}

/**
 * @name TotalAssetAmount
 * @description display the total asset amount in USD
 */
export const TotalAssetAmount: FC<TotalAssetAmountProps> = ({
  account,
  ...other
}) => {
  const amount = useTotalAmount(account);

  return (
    <FormatFixed18
      data={amount}
      prefix='$'
      {...other}
    />
  );
};
