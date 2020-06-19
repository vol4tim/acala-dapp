import React, { useContext, FC, ReactNode } from 'react';

import { Card, TableConfig, Table, Condition } from '@acala-dapp/ui-components';
import { useCurrentRedeem } from '@acala-dapp/react-hooks';
import { TxButton, FormatBalance } from '@acala-dapp/react-components';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

import classes from './RedeemList.module.scss';
import { StakingPoolContext } from './StakingPoolProvider';

export const RedeemList: FC = () => {
  const currentRedeem = useCurrentRedeem();
  const { redeemList, stakingPool } = useContext(StakingPoolContext);

  const renderHeader = (): ReactNode => {
    return (
      <div className={classes.header}>
        <div>Redeem Tracker</div>
        <div className={classes.currentRedeem}>
          {
            currentRedeem && stakingPool ? (
              <FormatBalance
                balance={convertToFixed18(currentRedeem.amount)}
                currency={stakingPool.stakingCurrency}
              />
            ) : null
          }
          {
            currentRedeem ? (
              <TxButton
                method='withdrawRedemption'
                params={[]}
                section='homa'
              >
                Withdraw
              </TxButton>
            ) : null
          }
        </div>
      </div>
    );
  };

  const tableConfig: TableConfig[] = [
    {
      align: 'left',
      dataIndex: 'era',
      /* eslint-disable-next-line react/display-name */
      render: (era: number): ReactNode => {
        return era;
      },
      title: 'Era'
    },
    {
      dataIndex: 'era',
      /* eslint-disable-next-line react/display-name */
      render: (era: number): ReactNode => {
        if (!stakingPool) {
          return '';
        }

        if (stakingPool.currentEra.toNumber() >= era) {
          return 'Done';
        }

        if (stakingPool.currentEra.toNumber() < era) {
          return 'Redeeming';
        }

        return '';
      },
      title: 'Status'
    },
    {
      align: 'right',
      dataIndex: 'balance',
      /* eslint-disable-next-line react/display-name */
      render: (balance: Fixed18): ReactNode => {
        return (
          <FormatBalance
            balance={balance}
            currency={stakingPool?.stakingCurrency}
          />
        );
      },
      title: 'Amount'
    }
  ];

  if (redeemList.length === 0 && !currentRedeem) {
    return null;
  }

  return (
    <Card
      header={renderHeader()}
      padding={false}
    >
      <Condition condition={!!redeemList.length}>
        <Table
          config={tableConfig}
          data={redeemList}
          showHeader
          size='small'
        />
      </Condition>
    </Card>
  );
};
