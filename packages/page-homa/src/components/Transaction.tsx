import React, { FC, useContext, useMemo } from 'react';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash } from '@acala-dapp/react-components';
import { TableConfig, Status } from '@acala-dapp/ui-components';
import { ExtrinsicHistoryData } from '@acala-dapp/react-hooks';
import { Fixed18 } from '@acala-network/app-util';
import { StakingPoolContext } from './StakingPoolProvider';

export const Transaction: FC = () => {
  const { stakingPool } = useContext(StakingPoolContext);

  const config = useMemo<TableConfig[]>(() => {
    if (!stakingPool) return [];

    return [
      {
        align: 'left',
        dataIndex: 'hash',
        /* eslint-disable-next-line react/display-name */
        render: (value): JSX.Element => <FormatHash hash={value} />,
        title: 'Tx Hash'
      },
      {
        align: 'left',
        /* eslint-disable-next-line react/display-name */
        render: (data: ExtrinsicHistoryData): JSX.Element | string => {
          if (data.method === 'mint') {
            return (
              <FormatBalance
                balance={Fixed18.fromParts(data?.params[0] || 0)}
                currency={stakingPool.stakingCurrency}
              />);
          }

          if (data.method === 'redeem') {
            const keys = Object.keys(data?.params[1]);

            return (
              <>
                <FormatBalance
                  balance={Fixed18.fromParts(data.params[0] || 0)}
                  currency={stakingPool.liquidCurrency}
                />
                {

                  <span style={{ marginLeft: 8 }}>
                    {(data.params[1] as any).Target ? `ERA: ${(data.params[1] as any).Target}` : keys }
                  </span>
                }
              </>
            );
          }

          return '/';
        },
        title: 'Token'
      },
      {
        align: 'left',
        dataIndex: 'method',
        /* eslint-disable-next-line react/display-name */
        render: (value: string): string | undefined => {
          const paramsMap: Map<string, string> = new Map([
            ['mint', 'Mint & Stake'],
            ['redeem', 'Redeem'],
            ['withdraw_redemption', 'Withdraw Redemption']
          ]);

          return paramsMap.get(value);
        },
        title: 'Stake/Redeem'
      },
      {
        align: 'right',
        dataIndex: 'time',
        /* eslint-disable-next-line react/display-name */
        render: (value): JSX.Element => <FormatTime time={value} />,
        title: 'When'
      },
      {
        align: 'right',
        dataIndex: 'success',
        /* eslint-disable-next-line react/display-name */
        render: (value): JSX.Element => <Status success={value} />,
        title: 'Result'
      }
    ];
  }, [stakingPool]);

  return (
    <BaseTxHistory
      config={config}
      method={''}
      section='homa'
    />
  );
};
