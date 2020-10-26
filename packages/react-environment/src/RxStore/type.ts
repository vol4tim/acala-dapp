import { DerivedStakingPool, DerivedUserLoan, DerivedLoanType } from '@acala-network/api-derive';
import { StakingPoolHelper, Fixed18, LoanHelper } from '@acala-network/app-util';
import { FixedPointNumber } from '@acala-network/sdk-core';

export interface StakingPoolWithHelper {
  stakingPool: DerivedStakingPool;
  helper: StakingPoolHelper;
}

export type PriceData = { currency: string; price: FixedPointNumber };

export interface LoanWithHelper {
  loan: DerivedUserLoan;
  type: DerivedLoanType;
  helper: LoanHelper;
}
