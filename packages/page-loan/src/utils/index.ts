import { Fixed18 } from '@acala-network/app-util';

export type LOAN_STATUS_TEXT = 'WARNING' | 'SAFE' | 'DANGEROUS';

export interface LoanStatus { status: LOAN_STATUS_TEXT; color: string; description?: string }

export const loanStatusConfig: {[k in LOAN_STATUS_TEXT]: LoanStatus } = {
  DANGEROUS: {
    color: '#fa0000',
    description: '(High Risk)',
    status: 'DANGEROUS'
  },
  SAFE: {
    color: '#8fce65',
    status: 'SAFE'
  },
  WARNING: {
    color: '#f7b500',
    description: '(Warning)',
    status: 'WARNING'
  }
};

export const getLoanStatus = (currentRatio: Fixed18, liquidationRatio: Fixed18, gap = 0.1): LoanStatus => {
  const _currentRatio = currentRatio.toNumber();
  const _liquidationRatio = liquidationRatio.toNumber();

  // dangerous
  if (_currentRatio < _liquidationRatio + gap) {
    return loanStatusConfig.DANGEROUS;
  }

  // warning
  if (_currentRatio < _liquidationRatio + 2 * gap) {
    return loanStatusConfig.WARNING;
  }

  return loanStatusConfig.SAFE;
};
