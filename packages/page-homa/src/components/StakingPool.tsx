import React, { FC, ReactNode } from 'react';
import { Table, Card, TableConfig } from '@acala-dapp/ui-components';
import { Token, FormatBalance, FormatRatio } from '@acala-dapp/react-components';
import { useStakingPool, useConstants } from '@acala-dapp/react-hooks';
import { StakingPoolData } from '@acala-dapp/react-environment/RxStore/type';

export const StakingPool: FC = () => {
  const { stakingCurrency } = useConstants();
  const stakingPool = useStakingPool();
  const tableConfig: TableConfig[] = [
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (): ReactNode => (
        <Token
          currency={stakingCurrency}
          icon
        />
      ),
      title: 'Pool'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (value: StakingPoolData): ReactNode => <FormatBalance balance={value.stakingPool.getTotalCommunalBalance()} />,
      title: 'Total'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (value: StakingPoolData): ReactNode => <FormatBalance balance={value.stakingPool.getCommunalBonded()} />,
      title: 'Total Bonded'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (value: StakingPoolData): ReactNode => <FormatBalance balance={value.stakingPool.getFreeUnbondedRatio().times(value.stakingPool.getTotalCommunalBalance())} />,
      title: 'Total Free'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (value: StakingPoolData): ReactNode => <FormatBalance balance={value.stakingPool.getUnbondingToFreeRatio().times(value.stakingPool.getTotalCommunalBalance())} />,
      title: 'Unbonding'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (value: StakingPoolData): ReactNode => (
        <FormatRatio data={value.stakingPool.getBondedRatio()} />
      ),
      title: 'Bond Ratio'
    }
  ];

  return (
    <Card
      header='Staking Pools'
      padding={false}
    >
      {
        stakingPool?.stakingPool ? (
          <Table
            config={tableConfig}
            data={[stakingPool]}
            showHeader
          />
        ) : null
      }
    </Card>
  );
};
