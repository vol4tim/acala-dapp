import React, { FC, ReactNode } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';

import { Section, Card, Table, TableConfig } from '@acala-dapp/ui-components';
import { Token, LPExchangeRate, LPSize, LPSizeWithShare } from '@acala-dapp/react-components';
import { useLPCurrencies, useApi } from '@acala-dapp/react-hooks';

import classes from './LPInformations.module.scss';

export const LPInformations: FC = () => {
  const allLPTokens = useLPCurrencies();

  const tableConfig: TableConfig[] = [
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => (
        <Token
          currency={token}
          icon
        />
      ),
      title: 'Pool',
      width: 3
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <LPExchangeRate lp={token} />,
      title: 'Price',
      width: 3
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <LPSize lp={token} />,
      title: 'Liquidity',
      width: 3
    }
    // {
    //   align: 'left',
    //   /* eslint-disable-next-line react/display-name */
    //   render: (token: CurrencyId): ReactNode => <LPSizeWithShare lp={token} />
    //   title: 'Share',
    //   width: 3
    // }
  ];

  return (
    <Section title='Liquidity Pools'>
      <Card padding={false}>
        <Table
          config={tableConfig}
          data={allLPTokens}
          headerCellClassName={classes.headerCell}
          showHeader
        />
      </Card>
    </Section>
  );
};
