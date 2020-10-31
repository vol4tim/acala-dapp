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
  const [showClaimed, setShowClaimed] = useState<boolean>(false);

  useInterval(() => {
    const current = dayjs();
    const startTime = dayjs('2020-10-31T12:00:07.208Z');

    if (current.isAfter(startTime)) {
      setShowClaimed(true);
    }
  }, 1000);

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

    if (!alreadyShow && showClaimed) {
      // open();
      setStorage('already-show-candy', 'true');
    }
  }, [open, setStorage, getStorage, showClaimed]);

  return (
    <Card
      header={
        <SpaceBetweenBox>
          <p>AirDrop</p>
          {
            showClaimed ? (
              <Button
                onClick={open}
              >
                Candy Claim
              </Button>
            ) : null
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
      {
        showClaimed ? (
          <Candy
            onClose={close}
            status={status}
          />
        ) : null
      }
    </Card>
  );
};
