import React, { FC } from 'react';

import { getTokenName, FormatFixed18, FormatBalance } from '@acala-dapp/react-components';
import { useTreasuryOverview } from '@acala-dapp/react-hooks';
import { Statistic } from '@acala-dapp/ui-components';

import classes from './TreasuryOverview.module.scss';

interface StatisticContentProps {
  value?: string;
  history?: {
    date: number;
    value: number;
  }[];
  scale?: any;
  color: string;
}

export const TreasuryOverview: FC = () => {
  const overview = useTreasuryOverview();

  if (!overview) return null;

  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <Statistic title='Surplus Pool'
          value={<FormatFixed18 data={overview.surplusPool.toString(0)} />} />
      </div>
      <div className={classes.item}>
        <Statistic title='Debit Pool'
          value={<FormatFixed18 data={overview.debitPool.toString(0)} />} />
      </div>
      {overview?.totalCollaterals?.map((item) => {
        return (
          <div className={classes.item}
            key={`collateral-${item.currency}`}>
            <Statistic
              title={`Current Collateral(${getTokenName(item.currency)})`}
              value={<FormatBalance balance={item.balance}
                currency={item.currency}
              />}
            />
          </div>
        );
      })}
    </div>
  );
};
