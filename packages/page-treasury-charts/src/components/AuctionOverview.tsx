import { useAuctionOverview } from '@acala-dapp/react-hooks';
import { Statistic } from '@acala-dapp/ui-components';
import { FormatFixed18 } from '@acala-dapp/react-components';
import React, { FC } from 'react';

import classes from './TreasuryOverview.module.scss';

export const AuctionOverview: FC = () => {
  const overview = useAuctionOverview();

  if (!overview) return null;

  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <Statistic title='Total Target Auction'
          value={<FormatFixed18 data={overview.totalTarget.toNumber(0)} />} />
      </div>
      <div className={classes.item}>
        <Statistic title='Total Surplus Auction'
          value={<FormatFixed18 data={overview.totalSurplus.toNumber(0)} />} />
      </div>
      <div className={classes.item}>
        <Statistic title='Total Debit Auction'
          value={<FormatFixed18 data={overview.totalDebit.toNumber(0)} />} />
      </div>
    </div>
  );
};
