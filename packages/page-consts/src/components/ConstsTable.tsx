import React, { FC, useMemo } from 'react';
import { Table } from 'antd';

import { ApiRx } from '@polkadot/api';
import { stringToU8a } from '@polkadot/util';

import { ModuleConstants, ConstantCodec } from '@polkadot/metadata/Decorated/types';
import { BareProps } from '@acala-dapp/ui-components/types';
import { formatNumber, getTokenName } from '@acala-dapp/react-components';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { useApi } from '@acala-dapp/react-hooks';

import classes from './consts.module.scss';

interface ConstsDetailProps extends BareProps {
  data: ModuleConstants;
}

function hexToString (hexStr: string): string {
  let i = 2;
  let result = '';

  while (i < hexStr.length) {
    result += String.fromCharCode('0x' + hexStr.slice(i, i + 2) as any);
    i += 2;
  }

  return result;
}

function getModuleIdAddress (api: ApiRx, moduleId: string): string {
  const id: Uint8Array = stringToU8a(`modl${moduleId}`.padEnd(32, '\0'));
  const AccountId = api.registry.get('AccountId') as any;
  const account = new AccountId(api.registry, id);

  return account.toString();
}

function dataFormatter (api: ApiRx, type: string, value: any): string {
  if (type.startsWith('Vec')) {
    const innerType = type.replace(/Vec<(.*?)>/, '$1');

    return value.map((item: any) => {
      return dataFormatter(api, innerType, item);
    }).join(',');
  }

  if (type === 'Balance' || type === 'BalanceOf' || type === 'Price') return formatNumber(convertToFixed18(value));

  if (type === 'Rate' || type === 'Ratio' || type === 'ExchangeRate') return convertToFixed18(value).mul(Fixed18.fromNatural(100)).toString() + '%';

  if (type === 'ModuleId') {
    const id = hexToString(value.toString());
    const address = getModuleIdAddress(api, id);

    return `${id}, ${address}`;
  }

  if (type === 'CurrencyId') return getTokenName(value);

  return value.toString();
}

export const ConstsTable: FC<ConstsDetailProps> = ({
  data
}) => {
  const { api } = useApi();

  const tableData = useMemo(() => {
    if (!api) return [];

    return Object.keys(data).map((constant) => {
      const _d = data[constant] as ConstantCodec;

      return {
        document: _d?.meta?.documentation?.toArray().join(','),
        key: `api-consts-${_d?.meta?.name.toString()}`,
        name: _d?.meta?.name.toString(),
        type: _d?.meta?.type.toString(),
        value: dataFormatter(api, _d?.meta?.type.toString(), _d)
      };
    });
  }, [data, api]);

  const tableColumns = useMemo(() => {
    return [
      {
        dataIndex: 'name',
        title: 'Name',
        width: 240
      },
      {
        dataIndex: 'type',
        title: 'Type',
        width: 240
      },
      {
        dataIndex: 'document',
        title: 'Documentation',
        width: 480
      },
      {
        align: 'right' as 'right',
        dataIndex: 'value',
        title: 'Value',
        width: 240
      }
    ];
  }, []);

  return (
    <Table
      className={classes.table}
      columns={tableColumns}
      dataSource={tableData}
      pagination={false}
      size='middle'
    />
  );
};
