import React, { FC, memo, useContext, ReactNode } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';

import { Card, TableConfig, Table } from '@acala-dapp/ui-components';
import { DexPoolSize, DexReward, DexRewardRatio, DexUserShare } from '@acala-dapp/react-components';

import { DepositContext } from './Provider';
import { AccountDexTokens } from './AccountDexTokens';

export const PoolOverview: FC = memo(() => {
  const { enabledCurrencyIds } = useContext(DepositContext);
  const tableConfig: TableConfig[] = [
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => (
        <AccountDexTokens token={token} />
      ),
      title: 'Token Pair',
      width: 3
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => (
        <DexPoolSize token={token} />
      ),
      title: 'Current Pool Size',
      width: 3
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => (
        <DexUserShare token={token} />
      ),
      title: 'Pool Share',
      width: 1
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <DexRewardRatio token={token} />,
      title: 'Reward Ratio',
      width: 1
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <DexReward token={token} />,
      title: 'Reward',
      width: 1
    }
  ];

  return (
    <Card header='Deposit'
      padding={false}>
      <Table
        config={tableConfig}
        data={enabledCurrencyIds}
        showHeader
      />
    </Card>
  );
});

PoolOverview.displayName = 'PoolOverview';
