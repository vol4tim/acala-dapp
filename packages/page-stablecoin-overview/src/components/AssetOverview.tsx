import React, { FC, useMemo } from 'react';
import { Table } from 'antd';
import { Card } from '@acala-dapp/ui-components';
import { useConstants } from '@acala-dapp/react-hooks';
import { Token, TotalCollateral, TotalDebit, TotalCollateralRatio, LiquidationRatio } from '@acala-dapp/react-components';

const AssetOverview: FC = () => {
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
        title: 'Locked'
      },
      {
        key: 'total_debit',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <TotalDebit currency={item.currency} />,
        title: 'Supply (aUSD)'
      },
      {
        key: 'collateral_ratio',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <TotalCollateralRatio currency={item.currency} />,
        title: 'Collaterals Ratio %'
      },
      {
        key: 'required_collaateral_ratio',
        /* eslint-disable-next-line react/display-name */
        render: (item: any): JSX.Element => <LiquidationRatio currency={item.currency} />,
        title: 'Liquidation Ratio %'
      }
    ];
  }, []);

  const data = useMemo(
    () =>
      loanCurrencies.map((item) => ({
        currency: item
      })),
    [loanCurrencies]
  );

  return (
    <Card header='Asset Overview'
      padding={false}>
      <Table columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={(id): string => id.currency.toString()}
      />
    </Card>
  );
};

export default AssetOverview;
