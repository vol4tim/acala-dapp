import React, { FC, useMemo } from 'react';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { FormatNumberProps, FormatRatio, FormatBalanceProps, FormatBalance } from './format';
import { useLoanHelper, useConstants, useLoanType, useLoanOverview, usePrice } from '@acala-dapp/react-hooks';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

type LoanPropertyProps<T> = T & {
  currency: CurrencyLike;
}

export const CollateralRate: FC<LoanPropertyProps<Omit<FormatNumberProps, 'data'>>> = ({
  currency,
  ...other
}) => {
  const helper = useLoanHelper(currency);

  if (!helper) {
    return null;
  }

  return (
    <FormatRatio
      {...other}
      data={helper.collateralRatio}
    />
  );
};

export const StableFeeAPR: FC<LoanPropertyProps<Omit<FormatNumberProps, 'data'>>> = ({
  currency,
  ...other
}) => {
  const helper = useLoanHelper(currency);

  if (!helper) {
    return null;
  }

  return (
    <FormatRatio
      {...other}
      data={helper.stableFeeAPR}
    />
  );
};

export const RequiredCollateralRatio: FC<LoanPropertyProps<Omit<FormatNumberProps, 'data'>>> = ({
  currency,
  ...other
}) => {
  const type = useLoanType(currency);

  if (!type) {
    return null;
  }

  return (
    <FormatRatio
      {...other}
      data={convertToFixed18(type.requiredCollateralRatio)}
    />
  );
};

export const LiquidationRatio: FC<LoanPropertyProps<Omit<FormatNumberProps, 'data'>>> = ({
  currency,
  ...other
}) => {
  const type = useLoanType(currency);

  if (!type) {
    return null;
  }

  return (
    <FormatRatio
      {...other}
      data={convertToFixed18(type.liquidationRatio)}
    />
  );
};

export const LiquidationPenalty: FC<LoanPropertyProps<Omit<FormatNumberProps, 'data'>>> = ({
  currency,
  ...other
}) => {
  const type = useLoanType(currency);

  if (!type) {
    return null;
  }

  return (
    <FormatRatio
      {...other}
      data={convertToFixed18(type.liquidationPenalty)}
    />
  );
};

export const Collateral: FC<LoanPropertyProps<FormatBalanceProps>> = ({
  currency,
  ...other
}) => {
  const helper = useLoanHelper(currency);

  if (!helper) {
    return null;
  }

  return (
    <FormatBalance
      {...other}
      balance={convertToFixed18(helper.collaterals)}
      currency={currency}
    />
  );
};

export const DebitAmount: FC<LoanPropertyProps<FormatBalanceProps>> = ({
  currency,
  ...other
}) => {
  const { stableCurrency } = useConstants();
  const helper = useLoanHelper(currency);

  if (!helper) {
    return null;
  }

  return (
    <FormatBalance
      {...other}
      balance={convertToFixed18(helper.debitAmount)}
      currency={stableCurrency}
    />
  );
};

export const TotalCollateral: FC<LoanPropertyProps<FormatBalanceProps>> = ({ currency, ...other }) => {
  const overview = useLoanOverview(currency);

  if (!overview) return null;

  return (
    <FormatBalance
      {...other}
      balance={convertToFixed18(overview.totalCollateral)}
      currency={currency}
    />
  );
};

export const TotalDebit: FC<LoanPropertyProps<FormatBalanceProps>> = ({ currency, ...other }) => {
  const overview = useLoanOverview(currency);
  const { stableCurrency } = useConstants();
  const result = useMemo<Fixed18>(() => {
    if (!overview) return Fixed18.ZERO;

    if (!overview.totalDebit || !overview.debitExchangeRate) return Fixed18.ZERO;

    return convertToFixed18(overview.totalDebit).mul(convertToFixed18(overview.debitExchangeRate));
  }, [overview]);

  if (!overview) return null;

  return (
    <FormatBalance
      {...other}
      balance={result}
      currency={stableCurrency}
    />
  );
};

export const TotalCollateralRatio: FC<LoanPropertyProps<Omit<FormatNumberProps, 'data'>>> = ({ currency, ...other }) => {
  const overview = useLoanOverview(currency);
  const price = usePrice(currency);
  const result = useMemo<Fixed18>(() => {
    if (!overview || !price) return Fixed18.ZERO;

    if (!overview.totalDebit || !overview.debitExchangeRate || !overview.totalCollateral) return Fixed18.ZERO;

    return (convertToFixed18(overview.totalCollateral).mul(price)).div(convertToFixed18(overview.totalDebit).mul(convertToFixed18(overview.debitExchangeRate)));
  }, [overview, price]);

  if (!overview) return null;

  return (
    <FormatRatio
      {...other}
      data={result}
    />
  );
};
