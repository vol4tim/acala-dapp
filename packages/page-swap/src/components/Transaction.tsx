import React, { FC, useRef, ReactNode } from 'react';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash } from '@acala-dapp/react-components';
import { TableConfig, Status } from '@acala-dapp/ui-components';
import { Fixed18 } from '@acala-network/app-util';

interface ActionProps {
  supply: string;
  supplyCurrency: string;
  target: string;
  targetCurrency: string;
}

const Action: FC<ActionProps> = ({
  supply,
  supplyCurrency,
  target,
  targetCurrency
}) => {
  return (
    <FormatBalance
      pair={[
        {
          balance: Fixed18.fromParts(supply),
          currency: supplyCurrency
        },
        {
          balance: Fixed18.fromParts(target),
          currency: targetCurrency
        }
      ]}
      pairSymbol='->'
    />
  );
};

export const Transaction: FC = () => {
  const config = useRef<TableConfig[]>([
    {
      align: 'left',
      dataIndex: 'hash',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => <FormatHash hash={value} />,
      title: 'Tx Hash',
      width: 1
    },
    {
      align: 'left',
      dataIndex: 'params',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => (
        <Action
          supply={value[1]}
          supplyCurrency={value[0]}
          target={value[3]}
          targetCurrency={value[2]}
        />
      ),
      title: 'Action',
      width: 3
    },
    {
      align: 'left',
      dataIndex: 'time',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => (
        <FormatTime time={value} />
      ),
      title: 'When',
      width: 1
    },
    {
      align: 'right',
      dataIndex: 'success',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => (
        <Status success={value} />
      ),
      title: 'Result',
      width: 1
    }
  ]);

  return (
    <BaseTxHistory
      config={config.current}
      method='swap_currency'
      section='dex'
    />
  );
};
