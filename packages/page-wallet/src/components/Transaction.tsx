import React, { FC, ReactNode } from 'react';

import { encodeAddress } from '@polkadot/keyring';
import { hexToU8a } from '@polkadot/util';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash, FormatAddress } from '@acala-dapp/react-components';
import { TableConfig, Status } from '@acala-dapp/ui-components';
import { Fixed18 } from '@acala-network/app-util';

export const Transaction: FC = () => {
  const config: TableConfig[] = [
    {
      align: 'left',
      dataIndex: 'hash',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => <FormatHash hash={value} />,
      title: 'Hash'
    },
    {
      align: 'left',
      dataIndex: 'params',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => {
        let address = '';

        try {
          address = encodeAddress(hexToU8a(`0x${value[0]}`));
        } catch (e) {
          // swallow error
        }

        return (
          <FormatAddress
            address={address}
            iconWidth={16}
            withCopy
            withIcon
          />
        );
      },
      title: 'To'
    },
    {
      align: 'right',
      dataIndex: 'params',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => (
        <FormatBalance
          balance={Fixed18.fromParts(value[2])}
          currency={value[1] as string}
        />
      ),
      title: 'Balance'
    },
    {
      align: 'right',
      dataIndex: 'time',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => (
        <FormatTime time={value} />
      ),
      title: 'When'
    },
    {
      align: 'right',
      dataIndex: 'success',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => (
        <Status success={value} />
      ),
      title: 'Result'
    }
  ];

  return (
    <BaseTxHistory
      config={config}
      method='transfer'
      section='currencies'
    />
  );
};
