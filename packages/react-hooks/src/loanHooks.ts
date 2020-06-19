import { CurrencyLike, AccountLike } from './types';
import { useAccounts } from './useAccounts';
import { useCall } from './useCall';
import { DerivedUserLoan, DerivedLoanType } from '@acala-network/api-derive';
import { LoanHelper } from '@acala-network/app-util';
import { useConstants } from './useConstants';
import { usePrice } from './priceHooks';
import { useMemo } from 'react';
import { filterEmptyLoan } from './utils';

export const useUserLoan = (currency: CurrencyLike, account?: AccountLike): DerivedUserLoan | undefined => {
  const { active } = useAccounts();
  const _account = account || (active ? active.address : '');
  const loan = useCall<DerivedUserLoan>('derive.loan.loan', [_account, currency]);

  return loan;
};

export const useLoanType = (currency: CurrencyLike): DerivedLoanType | undefined => {
  const type = useCall<DerivedLoanType>('derive.loan.loanType', [currency]);

  return type;
};

export const useLoanHelper = (currency: CurrencyLike, account?: AccountLike): LoanHelper | null => {
  const { stableCurrency } = useConstants();
  const loan = useUserLoan(currency, account);
  const type = useLoanType(currency);
  const stableCurrencyPrice = usePrice(stableCurrency);
  const loanCurrencyPrice = usePrice(currency);
  const helper = useMemo((): LoanHelper | null => {
    if (!loan || !type || !stableCurrencyPrice || !loanCurrencyPrice) {
      return null;
    }

    return new LoanHelper({
      collateralPrice: loanCurrencyPrice,
      collaterals: loan.collaterals,
      debitExchangeRate: type.debitExchangeRate,
      debits: loan.debits,
      expectedBlockTime: type.expectedBlockTime.toNumber(),
      globalStableFee: type.globalStabilityFee,
      liquidationRatio: type.liquidationRatio,
      requiredCollateralRatio: type.requiredCollateralRatio,
      stableCoinPrice: stableCurrencyPrice,
      stableFee: type.stabilityFee
    });
  }, [loan, loanCurrencyPrice, stableCurrencyPrice, type]);

  return helper;
};

export const useAllUserLoans = (filterEmpyt?: boolean, account?: AccountLike): DerivedUserLoan[] | null => {
  const { active } = useAccounts();
  const _account = account || (active ? active.address : '');
  const loans = useCall<DerivedUserLoan[]>('derive.loan.allLoans', [_account]) || [];

  if (!loans) {
    return null;
  }

  return filterEmpyt ? filterEmptyLoan(loans) : loans;
};
