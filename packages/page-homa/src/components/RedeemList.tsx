import React, { FC, ReactNode } from 'react';

import { Card, TableConfig, Table, Condition, SpaceBetweenBox, FlexBox, PaddingBox } from '@acala-dapp/ui-components';
import { useCurrentRedeem, useStakingPool, useConstants, useRedeemList } from '@acala-dapp/react-hooks';
import { TxButton, FormatBalance } from '@acala-dapp/react-components';
import { Fixed18 } from '@acala-network/app-util';

export const RedeemList: FC = () => {
  const { stakingCurrency } = useConstants();
  const { currentRedeem, query } = useCurrentRedeem();
  const redeemList = useRedeemList();
  const stakingPool = useStakingPool();

  const renderHeader = (): ReactNode => {
    return (
      <SpaceBetweenBox>
        <div>Redeem Tracker</div>
        {
          !currentRedeem.isZero() ? (
            <FlexBox
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <PaddingBox padding={'0 8px 0 0'}>
                <FormatBalance
                  balance={currentRedeem}
                  currency={stakingCurrency}
                />
              </PaddingBox>
              <TxButton
                method='withdrawRedemption'
                onExtrinsicSuccsss={query}
                params={[]}
                section='homa'
              >
                Withdraw
              </TxButton>
            </FlexBox>

          ) : null
        }
      </SpaceBetweenBox>
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

        if (stakingPool.derive.currentEra.toNumber() >= era) {
          return 'Done';
        }

        if (stakingPool.derive.currentEra.toNumber() < era) {
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
            currency={stakingCurrency}
          />
        );
      },
      title: 'Amount'
    }
  ];

  if (redeemList.length === 0 && currentRedeem.isZero()) {
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
