import { DerivedStakingPool, DerivedUserLoan, DerivedLoanType } from '@acala-network/api-derive';
import { StakingPoolHelper, Fixed18, LoanHelper } from '@acala-network/app-util';

export interface StakingPoolWithHelper {
  stakingPool: DerivedStakingPool;
  helper: StakingPoolHelper;
}

export type PriceData = { currency: string; price: Fixed18 };

export interface LoanWithHelper {
  loan: DerivedUserLoan;
  type: DerivedLoanType;
  helper: LoanHelper;
}
