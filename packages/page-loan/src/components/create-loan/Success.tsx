import React, { FC, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@acala-dapp/ui-components';
import { ReactComponent as SuccessBg } from '../../assets/success-bg.svg';

import classes from './Success.module.scss';
// import { LoanContext } from './LoanProvider';
import { createProviderContext } from './CreateProvider';

export const Success: FC = () => {
  // const { setCurrentTab } = useContext(LoanContext);
  const navigate = useNavigate();
  const { selectedToken } = useContext(createProviderContext);

  const handleDone = (): void => {
    // setCurrentTab(selectedToken);
    navigate(`/loan/${selectedToken.asToken.toString()}`);
  };

  return (
    <div className={classes.root}>
      <p className={classes.title}>Your loan is created, and aUSD is generated!</p>
      <SuccessBg className={classes.bg} />
      <Button
        onClick={handleDone}
        size='small'
      >
      Done
      </Button>
    </div>
  );
};
