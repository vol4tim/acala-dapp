import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Card, TableConfig, Table, SpaceBetweenBox, Button } from '@acala-dapp/ui-components';
import { useApi, useModal, useStorage, useInterval } from '@acala-dapp/react-hooks';
import { tokenEq, AirDropAmount } from '@acala-dapp/react-components';
import { AirDropCurrencyId } from '@acala-network/types/interfaces';
import { Candy } from './Candy';

export const AirDrop: FC = () => {
  const { api } = useApi();
  const keys = (api.registry.createType('AirDropCurrencyId' as any) as AirDropCurrencyId).defKeys;
  const { close, open, status } = useModal();
  const { getStorage, setStorage } = useStorage({ useAccountPrefix: false });
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

  useEffect(() => {
    const alreadyShow = getStorage('already-show-candy');

    if (!alreadyShow) {
      open();
      setStorage('already-show-candy', 'true');
    }
  }, [open, setStorage, getStorage]);

  return (
    <Card
      header={
        <SpaceBetweenBox>
          <p>AirDrop</p>
          {
            <Button
              onClick={open}
            >
              Candy Claim
            </Button>
          }
        </SpaceBetweenBox>
      }
      padding={false}
    >
      <Table<string>
        config={tableConfig}
        data={keys}
        showHeader
      />
      <Candy
        onClose={close}
        status={status}
      />
    </Card>
  );
};
