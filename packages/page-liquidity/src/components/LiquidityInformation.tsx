import React, { FC, ReactNode } from 'react';

import { Card, TableConfig, Table } from '@acala-dapp/ui-components';
import { LPSize, Token, LPShare } from '@acala-dapp/react-components';
import { CurrencyId } from '@acala-network/types/interfaces';

import { useLPCurrencies } from '@acala-dapp/react-hooks';

export const LiquidityInformation: FC = () => {
  const lpCurrencies = useLPCurrencies();

  const tableConfig: TableConfig[] = [
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => (
        <Token currency={token} />
      ),
      title: 'Pool',
      width: 3
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => (
        <LPSize lp={token} />
      ),
      title: 'Pool Size',
      width: 3
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => (
        <LPShare
          lp={token}
          showRatio
        />
      ),
      title: 'Pool Share',
      width: 1
    }
  ];

  return (
    <Card header='Deposit'
      padding={false}>
      <Table
        config={tableConfig}
        data={lpCurrencies}
        showHeader
      />
    </Card>
  );
};
