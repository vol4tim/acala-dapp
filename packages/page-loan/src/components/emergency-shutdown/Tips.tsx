import React, { FC, useContext } from 'react';
import { Alert } from '@acala-dapp/ui-components';
import { EmergencyShutdownStep, EmergencyShutdownContext } from './EmergencyShutdownProvider';
import { ReactComponent as LockIcon } from '../../assets/lock-logo.svg';
import classes from './Tips.module.scss';

const TIPS_AT_STEP: Record<EmergencyShutdownStep, string> = {
  process: 'The system will cancel all auctions, process all debts owed, once this is complete, users can repay aUSD to withdraw collaterals.',
  reclaim: 'aUSD owners reclaim collaterals based on set price and baskets of assets available',
  success: '',
  trigger: 'All loans are locked, free collaterals can be withdrawn, collateral prices will be set, and the system will process all loans & debts.'
};

export const Tips: FC = () => {
  const { step } = useContext(EmergencyShutdownContext);

  // don't display tips component if step is at success
  if (step === 'success') return null;

  return (
    <Alert
      className={classes.root}
      icon={<LockIcon />}
      message={TIPS_AT_STEP[step]}
    />
  );
};
