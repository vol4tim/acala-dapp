import React, { FC, ReactNode } from 'react';

import { Col, Card, ColumnsType, Table, Condition, FlexBox, PaddingBox } from '@acala-dapp/ui-components';
import { useCurrentRedeem, useStakingPool, useConstants, useRedeemList, RedeemItem } from '@acala-dapp/react-hooks';
import { TxButton, FormatBalance } from '@acala-dapp/react-components';

export const RedeemList: FC = () => {
  const { stakingCurrency } = useConstants();
  const { currentRedeem, query } = useCurrentRedeem();
  const redeemList = useRedeemList();
  const stakingPool = useStakingPool();

  const renderHeader = (): ReactNode => {
    return (
      <FlexBox
        justifyContent='space-between'
        width='100%'
      >
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
      </FlexBox>
    );
  };

  const tableConfig: ColumnsType<RedeemItem> = [
    {
      align: 'left',
      key: 'era',
      /* eslint-disable-next-line react/display-name */
      render: ({ era }): ReactNode => {
        return era;
      },
      title: 'Era'
    },
    {
      key: 'status',
      /* eslint-disable-next-line react/display-name */
      render: ({ era }): ReactNode => {
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
      /* eslint-disable-next-line react/display-name */
      render: ({ balance }): ReactNode => (
        <FormatBalance
          balance={balance}
          currency={stakingCurrency}
        />
      ),
      title: 'Amount'
    }
  ];

  if (redeemList.length === 0 && currentRedeem.isZero()) {
    return null;
  }

  return (
    <Col span={24}>
      <Card
        header={renderHeader()}
        padding={false}
      >
        <Condition condition={!!redeemList.length}>
          <Table
            columns={tableConfig}
            dataSource={redeemList}
            pagination={false}
            showHeader
            size='small'
          />
        </Condition>
      </Card>
    </Col>
  );
};
