import React, { FC, useMemo } from 'react';

import AccountId from '@polkadot/types/generic/AccountId';
import { CurrencyId } from '@acala-network/types/interfaces';

import { useBalance, useValue, useTotalValue, usePrice } from '@acala-dapp/react-hooks';

import { FormatBalance, FormatFixed18, FormatBalanceProps, FormatValue, FormatNumberProps } from './format';
import { AccountLike, CurrencyLike } from '@acala-dapp/react-hooks/types';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { BareProps } from '@acala-dapp/ui-components/types';

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

interface UserAssetValueProps extends BareProps {
  account?: AccountId | string;
  currency: CurrencyId | string;
}

/**
 * @name UserAssetValue
 * @description display user asset amount in USD
 */
export const UserAssetValue: FC<UserAssetValueProps> = ({ account, className, currency }) => {
  const amount = useValue(currency, account);

  if (!amount) return null;

  return (
    <FormatValue
      className={className}
      data={amount}
    />
  );
};

export interface TotalUserAssetValueProps extends BareProps {
  account?: AccountId | string;
}

/**
 * @name TotalUserAssetValue
 * @description display the total asset amount in USD
 */
export const TotalUserAssetValue: FC<TotalUserAssetValueProps> = ({
  account,
  className
}) => {
  const amount = useTotalValue(account);

  return (
    <FormatValue
      className={className}
      data={amount}
    />
  );
};

export interface AssetValueProps extends FormatNumberProps {
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
