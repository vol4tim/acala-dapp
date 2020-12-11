import React, { FC, useState, useEffect, ReactNode } from 'react';
import { Card, ColumnsType, Table } from '@acala-dapp/ui-components';
import { useAllUserLoans, filterEmptyLoan } from '@acala-dapp/react-hooks';
import { DerivedUserLoan } from '@acala-network/api-derive';
import { Token, FormatBalance, TxButton } from '@acala-dapp/react-components';
import { convertToFixed18 } from '@acala-network/app-util';

export const WithdrawNoDebitLoan: FC = () => {
  const [empty, setEmpty] = useState<boolean>(true);

  const loans = useAllUserLoans();

  const tableConfig: ColumnsType<DerivedUserLoan> = [
    {
      align: 'left',
      dataIndex: 'token',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => (
        <Token currency={currency} />
      ),
      title: 'Token',
      width: 1
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (data): ReactNode => (
        <FormatBalance
          balance={convertToFixed18(data.collateral)}
          currency={data.currency}
        />
      ),
      title: 'Collateral',
      width: 4
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (data): ReactNode => {
        const params = [data.currency, '-' + data.collateral, '0'];

        return (
          <TxButton
            method='adjustLoan'
            params={params}
            section='honzon'
            size='small'
          >
            Widthdraw
          </TxButton>
        );
      },
      title: '',
      width: 1
    }
  ];

  useEffect(() => {
    if (!loans) return;

    setEmpty(!filterEmptyLoan(loans).length);
  }, [loans]);

  // wait loading data
  if (empty) {
    return null;
  }

  return (
    <Card header='Free Collteral'
      padding={false}
    >
      <Table
        columns={tableConfig}
        dataSource={filterEmptyLoan(loans)}
        pagination={false}
      />
    </Card>
  );
};
