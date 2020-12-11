import React, { FC, useMemo } from 'react';
import { Card, Table } from '@acala-dapp/ui-components';
import { useConstants } from '@acala-dapp/react-hooks';
import { Token, TotalCollateral, TotalDebit, RequiredCollateralRatio, TotalCollateralRatio } from '@acala-dapp/react-components';

export const LoansOverview: FC = () => {
  const { loanCurrencies } = useConstants();

  const columns = useMemo(() => {
    return [
      {
        key: 'currency',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => (
          <Token
            currency={item.currency}
            fullname={true}
            icon={true}
          />
        ),
        title: 'Currency'
      },
      {
        key: 'total_collateral',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <TotalCollateral currency={item.currency} />,
        title: 'Total Collateral'
      },
      {
        key: 'total_debit',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <TotalDebit currency={item.currency} />,
        title: 'Total Debit'
      },
      {
        key: 'collateral_ratio',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <TotalCollateralRatio currency={item.currency} />,
        title: 'Current collateralization'
      },
      {
        key: 'required_collaateral_ratio',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <RequiredCollateralRatio currency={item.currency} />,
        title: 'Required collateralization'
      }
    ];
  }, []);

  const data = useMemo(() =>
    loanCurrencies.map((item) => ({ currency: item })),
  [loanCurrencies]);

  return (
    <Card header='Loans Overview'
      padding={false}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={'currency'}
      />
    </Card>
  );
};
