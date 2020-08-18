import React, { FC, useContext, ReactNode } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';

import { Section, Card, Table, TableConfig } from '@acala-dapp/ui-components';
import { Token, DexExchangeRate, DexPoolSize } from '@acala-dapp/react-components';

import { SwapContext } from './SwapProvider';
import classes from './AllMarkets.module.scss';

export const AllMarkets: FC = () => {
  const { dexBaseCurrency, supplyCurrencies } = useContext(SwapContext);
  const _supplyCurrencies = supplyCurrencies.filter((item: string | CurrencyId) => item.toString() !== dexBaseCurrency.toString());
  const tableConfig: TableConfig[] = [
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: string | CurrencyId): ReactNode => (
        <Token
          currency={token}
          icon
        />
      ),
      title: 'Token Pair',
      width: 1
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: string | CurrencyId): ReactNode => <DexExchangeRate supply={token} />,
      title: 'Exchange Rate',
      width: 3
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: string | CurrencyId): ReactNode => <DexPoolSize token={token} />,
      title: 'Pool Size',
      width: 3
    }
  ];

  return (
    <Section title='All Markets'>
      <Card padding={false}>
        <Table
          config={tableConfig}
          data={_supplyCurrencies}
          headerCellClassName={classes.headerCell}
          showHeader
        />
      </Card>
    </Section>
  );
};
