import React, { FC } from 'react';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { FormatFixed18Props, FormatFixed18, FormatBalanceProps, FormatBalance } from './format';
import { useLoanHelper, useConstants, useLoanType } from '@acala-dapp/react-hooks';
import { convertToFixed18 } from '@acala-network/app-util';

type LoanPropertyProps<T> = T & {
  currency: CurrencyLike;
}

export const CollateralRate: FC<LoanPropertyProps<FormatFixed18Props>> = ({
  currency,
  ...other
}) => {
  const helper = useLoanHelper(currency);

  if (!helper) {
    return null;
  }

  return (
    <FormatFixed18
      data={helper.collateralRatio}
      format='percentage'
      {...other}
    />
  );
};

export const StableFeeAPR: FC<LoanPropertyProps<FormatFixed18Props>> = ({
  currency,
  ...other
}) => {
  const helper = useLoanHelper(currency);

  if (!helper) {
    return null;
  }

  return (
    <FormatFixed18
      data={helper.stableFeeAPR}
      format='percentage'
      {...other}
    />
  );
};

export const RequiredCollateralRatio: FC<LoanPropertyProps<FormatFixed18Props>> = ({
  currency,
  ...other
}) => {
  const helper = useLoanHelper(currency);

  if (!helper) {
    return null;
  }

  return (
    <FormatFixed18
      data={helper.requiredCollateralRatio}
      format='percentage'
      {...other}
    />
  );
};

export const LiquidationRatio: FC<LoanPropertyProps<FormatFixed18Props>> = ({
  currency,
  ...other
}) => {
  const helper = useLoanHelper(currency);

  if (!helper) {
    return null;
  }

  return (
    <FormatFixed18
      data={helper.liquidationRatio}
      format='percentage'
      {...other}
    />
  );
};

export const LiquidationPenalty: FC<LoanPropertyProps<FormatFixed18Props>> = ({
  currency,
  ...other
}) => {
  const type = useLoanType(currency);

  if (!type) {
    return null;
  }

  return (
    <FormatFixed18
      data={convertToFixed18(type.liquidationPenalty)}
      format='percentage'
      {...other}
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
      balance={convertToFixed18(helper.collaterals)}
      currency={currency}
      {...other}
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
      balance={convertToFixed18(helper.debitAmount)}
      currency={stableCurrency}
      {...other}
    />
  );
};
