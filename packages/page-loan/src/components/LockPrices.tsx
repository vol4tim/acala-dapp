import React, { FC, useMemo } from 'react';
import { useLockPrices } from '@acala-dapp/react-hooks/useLockPrices';
import { Table, TableConfig } from '@acala-dapp/ui-components';
import { Token, FormatFixed18 } from '@acala-dapp/react-components';
import { Fixed18 } from '@acala-network/app-util';
import { BareProps } from '@acala-dapp/ui-components/types';

type PriceData = { currency: string; price: Fixed18 };

export const LockPrices: FC<BareProps> = ({ className }) => {
  const prices = useLockPrices();

  const data = useMemo<PriceData[]>(() => {
    return Object.keys(prices).map((currency: string): PriceData => {
      return {
        currency,
        price: prices[currency]
      };
    });
  }, [prices]);

  const config: TableConfig[] = [
    {
      align: 'left',
      dataIndex: 'currency',
      /* eslint-disable-next-line react/display-name */
      render: (currency: string): JSX.Element => {
        return <Token currency={currency} />;
      },
      title: 'currency'
    },
    {
      align: 'right',
      dataIndex: 'price',
      /* eslint-disable-next-line react/display-name */
      render: (price: Fixed18): JSX.Element => {
        return (
          <FormatFixed18
            data={price}
            prefix='$'
          />
        );
      },
      title: 'price'
    }
  ];

  return (
    <Table
      border
      className={className}
      config={config}
      data={data}
      showHeader
      size='small'
    />
  );
};
