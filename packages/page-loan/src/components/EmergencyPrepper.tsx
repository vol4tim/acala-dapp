import React, { FC, useMemo } from 'react';
import { useConstants, useCall } from '@acala-dapp/react-hooks';
import { TableConfig, Table } from '@acala-dapp/ui-components';
import { Token, WatchStorage, FormatFixed18 } from '@acala-dapp/react-components';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { Balance } from '@acala-network/types/interfaces/runtime';
import { ExchangeRate } from '@acala-network/types/interfaces';
import { Option } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';

const TotalDebit: FC<{ token: string}> = ({ token }) => {
  const exchangeRate = useCall<Option<ExchangeRate>>('query.cdpEngine.debitExchangeRate', [token]);
  const totalDebit = useCall<Balance>('query.loans.totalDebits', [token]);

  const _debit = useMemo(() => {
    if (!exchangeRate || !totalDebit) {
      return Fixed18.ZERO;
    }

    return convertToFixed18(exchangeRate).mul(convertToFixed18(totalDebit));
  }, [exchangeRate, totalDebit]);

  return <FormatFixed18 data={_debit} />;
};

export const EmergencyPrepeper: FC = () => {
  const { loanCurrencies } = useConstants();

  const config: TableConfig[] = [
    {
      align: 'left',
      /* eslint-disable react/display-name */
      render: (token: string): JSX.Element => {
        return <Token currency={token} />;
      },
      title: 'Token'
    },
    {
      align: 'left',
      /* eslint-disable react/display-name */
      render: (token: string): JSX.Element => {
        return <TotalDebit token={token} />;
      },
      title: 'Total Debit'
    },
    {
      align: 'left',
      /* eslint-disable react/display-name */
      render: (token: string): JSX.Element => {
        return (
          <WatchStorage
            params={[token]}
            path='query.auctionManager.totalCollateralInAuction'
            render={(data: Codec | undefined): JSX.Element => <FormatFixed18 data={data ? convertToFixed18(data) : Fixed18.ZERO} /> }
          />
        );
      },
      title: 'Total Auction Collateral'
    },
    {
      align: 'left',
      /* eslint-disable react/display-name */
      render: (token: string): JSX.Element => {
        return (
          <WatchStorage
            params={[token]}
            path='query.cdpTreasury.totalCollaterals'
            render={(data: Codec | undefined): JSX.Element => <FormatFixed18 data={data ? convertToFixed18(data) : Fixed18.ZERO} /> }
          />
        );
      },
      title: 'Can Refund'
    }
  ];

  return (
    <Table border
      config={config}
      data={loanCurrencies}
      showHeader
      size='small'
    />
  );
};
