import React, { FC, ReactNode } from 'react';
import { Card, TableConfig, Table, SpaceBetweenBox } from '@acala-dapp/ui-components';
import { useApi } from '@acala-dapp/react-hooks';
import { tokenEq, AirDropAmount } from '@acala-dapp/react-components';
import { AirDropCurrencyId } from '@acala-network/types/interfaces';
import { Candy } from './Candy';

export const AirDrop: FC = () => {
  const { api } = useApi();
  const keys = (api.registry.createType('AirDropCurrencyId' as any) as AirDropCurrencyId).defKeys;

  const tableConfig: TableConfig[] = [
    {
      align: 'left',
      key: 'token',
      render: (token: string): string => tokenEq(token, 'ACA') ? `${token} (Mainnet)` : token,
      title: 'Token'
    },
    {
      align: 'right',
      key: 'balance',
      /* eslint-disable-next-line react/display-name */
      render: (token: string): ReactNode => <AirDropAmount currency={token} />,
      title: 'Balance'
    }
  ];

  return (
    <Card
      header={
        <SpaceBetweenBox>
          <p>AirDrop</p>
          <Candy />
        </SpaceBetweenBox>
      }
      padding={false}
    >
      <Table<string>
        config={tableConfig}
        data={keys}
        showHeader
      />
    </Card>
  );
};
