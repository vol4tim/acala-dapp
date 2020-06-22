import React, { FC, useMemo } from 'react';

import AccountId from '@polkadot/types/generic/AccountId';
import { CurrencyId } from '@acala-network/types/interfaces';

import { useBalance, useAmount, useTotalAmount, usePrice } from '@acala-dapp/react-hooks';

import { FormatBalance, FormatFixed18, FormatFixed18Props, FormatBalanceProps } from './format';
import { AccountLike, CurrencyLike } from '@acala-dapp/react-hooks/types';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';

interface UserAssetBalanceProps extends FormatBalanceProps {
  account?: AccountLike;
  currency: CurrencyLike;
  showCurrency?: boolean;
}

/**
 * @name UserAssetBalance
 * @description display user asset balance
 */
export const UserAssetBalance: FC<UserAssetBalanceProps> = ({ account, currency, showCurrency, ...other }) => {
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

interface UserAssetAmountProps extends FormatFixed18Props{
  account?: AccountId | string;
  quantity?: number;
  currency: CurrencyId | string;
}

/**
 * @name UserAssetAmount
 * @description display user asset amount in USD
 */
export const UserAssetAmount: FC<UserAssetAmountProps> = ({
  account,
  currency,
  prefix = '≈ US $',
  ...other
}) => {
  const amount = useAmount(currency, account);

  if (!amount) return null;

  return (
    <FormatFixed18
      data={amount}
      prefix={prefix}
      {...other}
    />
  );
};

export interface TotalUserAssetAmountProps extends FormatFixed18Props {
  account?: AccountId | string;
}

/**
 * @name TotalUserAssetAmount
 * @description display the total asset amount in USD
 */
export const TotalUserAssetAmount: FC<TotalUserAssetAmountProps> = ({
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

export interface AssetValueProps extends FormatFixed18Props {
  quantity: number | Fixed18;
  currency: CurrencyLike;
}

export const AssetValue: FC<AssetValueProps> = ({
  currency,
  quantity,
  ...other
}) => {
  const price = usePrice(currency);
  const result = useMemo(() => {
    if (!price || !quantity) return Fixed18.ZERO;

    return convertToFixed18(quantity).mul(price);
  }, [price, quantity]);

  return (
    <FormatFixed18
      data={result}
      prefix='≈ $USA'
      {...other}
    />
  );
};
