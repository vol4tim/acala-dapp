import React, { FC, useRef, useContext, ReactNode } from 'react';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash } from '@acala-dapp/react-components';
import { TableConfig, Status } from '@acala-dapp/ui-components';
import { ExtrinsicHistoryData, useConstants } from '@acala-dapp/react-hooks';
import { Fixed18 } from '@acala-network/app-util';
import { DepositContext } from './Provider';

const actionMap: { [key: string]: string } = {
  deposit: 'add_liquidity',
  reward: 'withdraw_incentive_interest',
  withdraw: 'withdraw_liquidity'
};

export const Transaction: FC = () => {
  const { dexBaseCurrency } = useConstants();
  const { action } = useContext(DepositContext);

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
      /* eslint-disable-next-line react/display-name */
      render: (data: ExtrinsicHistoryData): ReactNode => {
        if (data.method === 'add_liquidity') {
          return (
            <FormatBalance
              pair={[
                {
                  balance: Fixed18.fromParts(data.params[1]),
                  currency: data.params[0]
                },
                {
                  balance: Fixed18.fromParts(data.params[2]),
                  currency: dexBaseCurrency
                }
              ]}
              pairSymbol='+'
            />
          );
        }

        if (data.method === 'withdraw_incentive_interest') {
          return '/';
        }

        if (data.method === 'withdrawIncentiveInterest') {
          return '/';
        }
      },
      title: 'Token',
      width: 3
    },
    {
      align: 'left',
      dataIndex: 'method',
      /* eslint-disable-next-line react/display-name */
      render: (value: string): ReactNode => {
        const paramsMap: Map<string, string> = new Map([
          ['add_liquidity', 'Deposit'],
          ['withdraw_liquidity', 'Withdraw'],
          ['withdraw_incentive_interest', 'Withdraw System Reward']
        ]);

        return paramsMap.get(value) || value;
      },
      title: 'Deposit/Withdraw',
      width: 1
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
      method={actionMap[action]}
      section='dex'
    />
  );
};
