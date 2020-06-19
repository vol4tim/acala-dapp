import React, { FC, useState, useEffect, ReactNode } from 'react';

import { BaseTxHistory, FormatTime, FormatHash, Token, formatBalance, getTokenName } from '@acala-dapp/react-components';
import { TableConfig, Status } from '@acala-dapp/ui-components';
import { useConstants, useApi } from '@acala-dapp/react-hooks';
import { Fixed18, debitToStableCoin, convertToFixed18 } from '@acala-network/app-util';
import { Codec } from '@polkadot/types/types';

const ZERO = Fixed18.ZERO;

interface ActionProps {
  collatera: string;
  debit: string;
  token: string;
  block: number;
}

const Action: FC<ActionProps> = ({
  block,
  collatera,
  debit,
  token
}) => {
  const { api } = useApi();
  const { stableCurrency } = useConstants();
  const _collateral = Fixed18.fromParts(collatera);
  const _debit = Fixed18.fromParts(debit);
  const [debitExchangeRate, setDebitExchangeRate] = useState<Codec>();

  useEffect(() => {
    if (api && block) {
      (async (): Promise<void> => {
        const hash = await api.query.system.blockHash(block).toPromise();
        const result = await api.query.cdpEngine.debitExchangeRate.at(hash, token).toPromise();

        setDebitExchangeRate(result);
      })();
    }
  }, [api, block, token]);

  const getDebit = (): string | Fixed18 => {
    if (!debitExchangeRate || debitExchangeRate.isEmpty) {
      return 'some';
    }

    if (_debit.isGreaterThan(ZERO)) {
      return formatBalance(debitToStableCoin(_debit, convertToFixed18(debitExchangeRate || 0)));
    }

    if (_debit.isLessThan(ZERO)) {
      return formatBalance(debitToStableCoin(_debit.negated(), convertToFixed18(debitExchangeRate || 0)));
    }

    return '';
  };

  const message: Array<string> = [];

  if (_collateral.isGreaterThan(ZERO)) {
    message.push(`Deposit ${formatBalance(_collateral)} ${getTokenName(token)}`);
  }

  if (_collateral.isLessThan(ZERO)) {
    message.push(`Withdraw ${formatBalance(_collateral.negated())} ${getTokenName(token)}`);
  }

  if (_debit.isGreaterThan(ZERO)) {
    message.push(
      `Generate ${getDebit()} ${getTokenName(stableCurrency)}`
    );
  }

  if (_debit.isLessThan(ZERO)) {
    message.push(
      `Pay Back ${getDebit()} ${getTokenName(stableCurrency)}`
    );
  }

  return <span>{message.join(', ')}</span>;
};

export const Transaction: FC = () => {
  const config: TableConfig[] = [
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
      render: (value): ReactNode => <Token currency={value[0]} />,
      title: 'Token',
      width: 1
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (data): ReactNode => (
        <Action
          block={data?.blockNum}
          collatera={data?.params[1]}
          debit={data?.params[2]}
          token={data?.params[0]}
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
  ];

  return (
    <BaseTxHistory
      config={config}
      method='adjust_loan'
      section='honzon'
    />
  );
};
