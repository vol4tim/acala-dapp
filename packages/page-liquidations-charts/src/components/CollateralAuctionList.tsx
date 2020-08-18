import { BalanceInput, FormatAddress, FormatBalance, numToFixed18Inner, TxButton } from '@acala-dapp/react-components';
import { useCall, useCollateralAuctions, useConstants } from '@acala-dapp/react-hooks';
import { Card } from '@acala-dapp/ui-components';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';
import { AuctionInfo } from '@open-web3/orml-types/interfaces';
import { Option } from '@polkadot/types';
import { Table } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import classes from './CollateralAuctionList.module.scss';

const AuctionLastBid: FC<{ id: string }> = ({ id }) => {
  const info = useCall<Option<AuctionInfo>>('query.auction.auctions', [id]);

  if (info) {
    console.log('!!', info.toHuman());
  }

  const bid = info?.unwrapOr(null)?.bid?.unwrapOr(null);

  if (!bid) {
    return <span>-</span>;
  }

  return (
    <div>
      <FormatAddress address={bid[0].toString()}
        withCopy />
      <FormatBalance balance={bid[1]}
        currency='aUSD' />
    </div>
  );
};

const AuctionPayment: FC<{ id: string; target: Fixed18 }> = ({ id, target }) => {
  const info = useCall<Option<AuctionInfo>>('query.auction.auctions', [id]);

  if (info) {
    console.log('!!', info.toHuman());
  }

  const bid = info?.unwrapOr(null)?.bid?.unwrapOr(null);

  if (!bid) {
    return <span>{target.toString()}</span>;
  }

  return (
    <span>
      {convertToFixed18(bid[1])
        .min(target)
        .toString()}
    </span>
  );
};

const AuctionReceiveCollateral: FC<{ id: string; target: Fixed18; amount: Fixed18 }> = ({ amount, id, target }) => {
  const info = useCall<Option<AuctionInfo>>('query.auction.auctions', [id]);

  if (info) {
    console.log('!!', info.toHuman());
  }

  const bid = info?.unwrapOr(null)?.bid?.unwrapOr(null);

  if (!bid) {
    return <span>{amount.toString()}</span>;
  }

  const lastBid = convertToFixed18(bid[1]);

  return (
    <span>
      {lastBid.isGreaterThan(target)
        ? target
          .div(lastBid)
          .mul(amount)
          .toString()
        : amount.toString()}
    </span>
  );
};

const AuctionMakeBid: FC<{ id: string }> = ({ id }) => {
  const [val, setVal] = useState(0);

  return (
    <div className={classes.auctionMakeBid}>
      <BalanceInput
        className={classes.auctionMakeBidInput}
        onChange={setVal}
        showIcon={false}
        showToken={false}
        size='mini'
        token='AUSD'
        value={val}
      />
      <TxButton
        className={classes.auctionMakeBidButton}
        disabled={val === 0}
        method='bid'
        params={[id, numToFixed18Inner(val)]}
        section='auction'
        size='small'
      >
        Bid
      </TxButton>
    </div>
  );
};

const CollateralAuctionList: FC = () => {
  const data = useCollateralAuctions();

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
        key: 'owner',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <FormatAddress address={item.owner}
          withCopy
          withMiniAddress />,
        title: 'owner'
      },
      {
        key: 'amount',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <FormatBalance balance={item.amount}
          currency={item.currency} />,
        title: 'Collateral Amt'
      },
      {
        key: 'target',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <FormatBalance balance={item.target}
          currency={stableCurrency} />,
        title: 'Target'
      },
      {
        key: 'start_time',
        render: (item: any): string => `#${item.startTime}`,
        title: 'Start Block'
      },
      {
        key: 'payment',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <AuctionPayment id={item.id}
          target={convertToFixed18(item.target)} />,
        title: 'Payment'
      },
      {
        key: 'receive_collateral',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => (
          <AuctionReceiveCollateral
            amount={convertToFixed18(item.amount)}
            id={item.id}
            target={convertToFixed18(item.target)}
          />
        ),
        title: 'Receive Collateral'
      },
      {
        key: 'bidder',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <AuctionLastBid id={item.id} />,
        title: 'Last Bid'
      },
      {
        key: 'bid',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <AuctionMakeBid id={item.id} />,
        title: 'Bid（Collateral Price in aUSD)'
      }
    ];
  }, [stableCurrency]);

  return (
    <Card header='Collateral Auction'
      padding={false}>
      <Table columns={columns}
        dataSource={data}
        rowKey='id' />
    </Card>
  );
};

export default CollateralAuctionList;
