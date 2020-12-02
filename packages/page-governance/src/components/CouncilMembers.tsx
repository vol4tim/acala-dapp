import React, { FC, ReactNode, useMemo } from 'react';
import { Card, Table, TableConfig } from '@acala-dapp/ui-components';
import { useCouncilMembers } from '@acala-dapp/react-hooks';
import AccountId from '@polkadot/types/generic/AccountId';
import { FormatAddress } from '@acala-dapp/react-components';
import { CouncilType } from '../config';
import { upperFirst } from 'lodash';

interface Props {
  council: CouncilType;
}

export const CouncilMembers: FC<Props> = ({ council }) => {
  const members = useCouncilMembers(council);

  const tableConfig: TableConfig[] = [
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (account: AccountId): ReactNode => {
        return (
          <FormatAddress
            address={account.toString()}
            withCopy
            withFullAddress
            withIcon
          />
        );
      },
      title: 'Account'
    }
  ];

  const header = useMemo(() => {
    return `${upperFirst(council)} Council Seats`;
  }, [council]);

  if (!members) return null;

  return (
    <Card
      header={header}
      padding={false}
    >
      <Table
        config={tableConfig}
        data={members}
      />
    </Card>
  );
};
