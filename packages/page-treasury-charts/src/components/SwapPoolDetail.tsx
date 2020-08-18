import React, { FC, useMemo } from 'react';

import { Table } from 'antd';
import { Card } from '@acala-dapp/ui-components';
import { useConstants, useSwapOverview } from '@acala-dapp/react-hooks';
import { Token, Price, FormatValue, FormatBalance } from '@acala-dapp/react-components';

export const SwapPoolDetail: FC = () => {
  const overview = useSwapOverview();
  const { stableCurrency } = useConstants();

  const columns = useMemo(() => {
    return [
      {
        key: 'currency',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <Token currency={item.currency} />,
        title: 'Currency'
      },
      {
        key: 'pool_other',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => (
          <FormatBalance
            pair={[
              {
                balance: item.other,
                currency: item.currency
              },
              {
                balance: item.base,
                currency: stableCurrency
              }
            ]}
            pairSymbol='+'
          />
        ),
        title: 'Token Pair'
      },
      {
        key: 'price',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <Price currency={item.currency} />,
        title: 'Price'
      },
      {
        key: 'value',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => (
          <FormatValue data={item.value} />
        ),
        title: 'Value'
      }
    ];
  }, [stableCurrency]);

  if (!overview) return null;

  return (
    <Card
      header='Loans Overview'
      padding={false}
    >
      <Table
        columns={columns}
        dataSource={overview.details}
        pagination={false}
      />
    </Card>
  );
};
