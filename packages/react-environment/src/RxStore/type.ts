import { DerivedUserLoan, DerivedLoanType, DerivedStakingPool } from '@acala-network/api-derive';
import { LoanHelper } from '@acala-network/app-util';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { StakingPool } from '@acala-network/sdk-homa';

export type PriceData = { currency: string; price: FixedPointNumber };

export type StakingPoolData = { stakingPool: StakingPool; derive: DerivedStakingPool };

export interface LoanWithHelper {
  loan: DerivedUserLoan;
  type: DerivedLoanType;
  helper: LoanHelper;
}
