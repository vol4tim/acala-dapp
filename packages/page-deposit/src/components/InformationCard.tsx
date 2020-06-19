import React, { FC, useContext } from 'react';

import { convertToFixed18 } from '@acala-network/app-util';

import { useDexTotalReward, useDexTotalDeposit, useDexTotalSystemReward } from '@acala-dapp/react-hooks';
import { Card } from '@acala-dapp/ui-components';
import { FormatBalance, FormatFixed18 } from '@acala-dapp/react-components';

import { ReactComponent as UserIcon } from '../assets/user.svg';
import { ReactComponent as SystemIcon } from '../assets/system.svg';
import classes from './InformationCard.module.scss';
import { DepositContext } from './Provider';

export const SystemCard: FC = () => {
  const { exchangeFee } = useContext(DepositContext);
  const totalReward = useDexTotalSystemReward();

  return (
    <Card
      className={classes.root}
      contentClassName={classes.content}
      divider={false}
      header='For System'
      headerClassName={classes.header}
      padding={false}
    >
      <div className={classes.avatar}>
        <SystemIcon />
      </div>
      <ul className={classes.list}>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Total Reward</p>
          <FormatBalance
            balance={totalReward.amount}
            className={classes.listContent}
            currency={totalReward.token}
            decimalLength={2}
            withTooltip={false}
          />
        </li>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Transaction Fee</p>
          <FormatFixed18
            className={classes.listContent}
            data={convertToFixed18(exchangeFee)}
            format='percentage'
            withTooltip={false}
          />
        </li>
      </ul>
    </Card>
  );
};

export const UserCard: FC = () => {
  const totalRewawrd = useDexTotalReward();
  const totalDeposit = useDexTotalDeposit();

  return (
    <Card
      className={classes.root}
      contentClassName={classes.content}
      divider={false}
      header='For User'
      headerClassName={classes.header}
      padding={false}
    >
      <div className={classes.avatar}>
        <UserIcon />
      </div>
      <ul className={classes.list}>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Total Reward</p>
          <FormatBalance
            balance={totalRewawrd.amount}
            className={classes.listContent}
            currency={totalRewawrd.token}
            decimalLength={2}
            withTooltip={false}
          />
        </li>
        <li className={classes.listItem}>
          <p className={classes.listTitle}>Total Deposit</p>
          <FormatBalance
            balance={totalDeposit.amount}
            className={classes.listContent}
            currency={totalDeposit.token}
            decimalLength={2}
            withTooltip={false}
          />
        </li>
      </ul>
    </Card>
  );
};
