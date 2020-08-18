import { FormatBalance } from '@acala-dapp/react-components';
import { DebitAuction, SurplusAuction, useConstants, useDebitAuctions, useSurplusAuction } from '@acala-dapp/react-hooks';
import { Card } from '@acala-dapp/ui-components';
import { Table } from 'antd';
import React, { FC, useMemo } from 'react';
import classes from './AuctionList.module.scss';

export const DebitAuctionList: FC<{ data: DebitAuction[] }> = ({ data }) => {
  const { stableCurrency } = useConstants();

  const columns = useMemo(() => {
    return [
      {
        key: 'id',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => item.id,
        title: 'Auction ID'
      },
      {
        key: 'amount',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <FormatBalance balance={item.amount}
          currency={stableCurrency} />,
        title: 'Amount'
      },
      {
        key: 'fix',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <FormatBalance balance={item.fix}
          currency={stableCurrency} />,
        title: 'Fix Amount'
      },
      {
        key: 'start_time',
        render: (item: any): string => `#${item.startTime}`,
        title: 'Start Block'
      }
    ];
  }, [stableCurrency]);

  return (
    <Card header='Debit Auction'
      padding={false}>
      <Table columns={columns}
        dataSource={data} />
    </Card>
  );
};

export const SurplusAuctinList: FC<{ data: SurplusAuction[] }> = ({ data }) => {
  const { stableCurrency } = useConstants();
  const columns = useMemo(() => {
    return [
      {
        key: 'id',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => item.id,
        title: 'Auction ID'
      },
      {
        key: 'amount',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <FormatBalance balance={item.amount}
          currency={stableCurrency} />,
        title: 'Amount'
      },
      {
        key: 'start_time',
        render: (item: any): string => `#${item.startTime}`,
        title: 'Start Block'
      }
    ];
  }, [stableCurrency]);

  return (
    <Card header='Surplus Auction'
      padding={false}>
      <Table columns={columns}
        dataSource={data} />
    </Card>
  );
};

export const AuctionList: FC = () => {
  const debitAuctions = useDebitAuctions();
  const surplusAuctions = useSurplusAuction();

  return (
    <div className={classes.root}>
      <DebitAuctionList data={debitAuctions} />
      <SurplusAuctinList data={surplusAuctions} />
    </div>
  );
};
