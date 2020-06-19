import React, { FC, useContext, ReactNode } from 'react';
import { Table, Card, TableConfig } from '@acala-dapp/ui-components';
import { Token, FormatBalance, FormatFixed18 } from '@acala-dapp/react-components';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { StakingPoolContext } from './StakingPoolProvider';

export const StakingPool: FC = () => {
  const { stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);
  const tableConfig: TableConfig[] = [
    {
      align: 'left',
      dataIndex: 'token',
      /* eslint-disable-next-line react/display-name */
      render: (value: CurrencyId): ReactNode => (
        <Token
          currency={value}
          icon
        />
      ),
      title: 'Pool'
    },
    {
      dataIndex: 'total',
      /* eslint-disable-next-line react/display-name */
      render: (value: Fixed18): ReactNode => <FormatBalance balance={value} />,
      title: 'Total'
    },
    {
      dataIndex: 'totalBonded',
      /* eslint-disable-next-line react/display-name */
      render: (value: Fixed18): ReactNode => <FormatBalance balance={value} />,
      title: 'Total Bonded'
    },
    {
      dataIndex: 'totalFree',
      /* eslint-disable-next-line react/display-name */
      render: (value: Fixed18): ReactNode => <FormatBalance balance={value} />,
      title: 'Total Free'
    },
    {
      dataIndex: 'totalUnbonding',
      /* eslint-disable-next-line react/display-name */
      render: (value: Fixed18): ReactNode => <FormatBalance balance={value} />,
      title: 'Unbonding'
    },
    {
      align: 'right',
      dataIndex: 'bondRatio',
      /* eslint-disable-next-line react/display-name */
      render: (value: Fixed18): ReactNode => (
        <FormatFixed18
          data={value}
          format='percentage'
        />
      ),
      title: 'Bond Ratio'
    }
  ];
  const data = [
    {
      bondRatio: stakingPoolHelper?.communalBondedRatio,
      token: stakingPool?.stakingCurrency,
      total: stakingPoolHelper?.communalTotal,
      totalBonded: stakingPoolHelper?.totalBonded,
      totalFree: stakingPoolHelper?.communalFree,
      totalUnbonding: stakingPoolHelper?.unbondingToFree
    }
  ];

  return (
    <Card
      header='Staking Pools'
      padding={false}
    >
      <Table
        config={tableConfig}
        data={data}
        showHeader
      />
    </Card>
  );
};
