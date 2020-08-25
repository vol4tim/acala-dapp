import React, { FC, memo, useContext, useMemo } from 'react';
import clsx from 'clsx';
import { TokenImage, TokenName, CollateralRate } from '@acala-dapp/react-components';

import { ReactComponent as OverviewIcon } from '../assets/overview.svg';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import classes from './LoanTopBar.module.scss';
import { useAllUserLoans, filterEmptyLoan } from '@acala-dapp/react-hooks';
import { LoanContext } from './LoanProvider';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

interface LoanItemProps {
  token: CurrencyLike;
}

const LoanItem: FC<LoanItemProps> = memo(({ token }) => {
  const { currentTab, setCurrentTab } = useContext(LoanContext);

  return (
    <div
      className={
        clsx(
          classes.item,
          {
            [classes.active]: currentTab === token
          }
        )
      }
      onClick={(): void => setCurrentTab(token)}
    >
      <div className={classes.icon}>
        <TokenImage currency={token} />
      </div>
      <div className={classes.content}>
        <TokenName
          className={classes.token}
          currency={token}
        />
        <CollateralRate
          className={classes.collateralRate}
          currency={token}
        />
      </div>
    </div>
  );
});

LoanItem.displayName = 'LoanItem';

const LoanOverview: FC = () => {
  const { currentTab, showOverview } = useContext(LoanContext);

  return (
    <div
      className={clsx(
        classes.item,
        classes.overview,
        {
          [classes.active]: currentTab === 'overview'
        }
      )}
      onClick={showOverview}
    >
      <div className={classes.icon}>
        <OverviewIcon />
      </div>
      <div className={classes.content}>
        OVERVIEW
      </div>
    </div>
  );
};

const LoanAdd: FC = () => {
  const { showCreate } = useContext(LoanContext);

  return (
    <div
      className={clsx(classes.item, classes.add)}
      onClick={showCreate}
    >
      <div className={classes.icon}>
        <AddIcon />
      </div>
      <div className={classes.content}>
        Create
      </div>
    </div>
  );
};

export const LoanTopBar: FC = () => {
  const loans = useAllUserLoans();

  const checkIfNeedAdd = useMemo((): boolean => {
    if (!loans) return false;

    return loans.length !== filterEmptyLoan(loans).length;
  }, [loans]);

  return (
    <div className={classes.root}>
      <LoanOverview />
      {
        filterEmptyLoan(loans).map((item) => (
          <LoanItem
            key={`loan-top-bar-${item.currency}`}
            token={item.currency}
          />
        ))
      }
      { checkIfNeedAdd ? <LoanAdd /> : null }
    </div>
  );
};
