import React, { FC, memo, ReactNode, useMemo } from 'react';

import { Fixed18 } from '@acala-network/app-util';
import { CurrencyId } from '@acala-network/types/interfaces';

import { Table, TableConfig, Card } from '@acala-dapp/ui-components';
import { useAllPrices } from '@acala-dapp/react-hooks';

import { getTokenName } from '../utils';
import { FormatPrice } from '../format';

export const PricesFeedCard: FC = memo(() => {
  const data = useAllPrices();

  const tableConfig: TableConfig[] = useMemo(() => [
    {
      align: 'left',
      dataIndex: 'currency',
      render (data: CurrencyId): ReactNode {
        return `${getTokenName(data)} in USD`;
      },
      title: 'Currency'
    },
    {
      align: 'right',
      dataIndex: 'price',
      render (data: Fixed18): ReactNode {
        return (
          <FormatPrice data={data} />
        );
      },
      title: 'Price'
    }
  ], []);

  return useMemo(() => {
    return (
      <Card header='Price Feed'
        padding={false}>
        <Table
          config={tableConfig}
          data={data}
          size='small'
        />
      </Card>
    );
  }, [data, tableConfig]);
});

PricesFeedCard.displayName = 'PricesFeedCard';
