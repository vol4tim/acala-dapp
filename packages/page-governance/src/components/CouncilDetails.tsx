import React, { FC, useMemo } from 'react';
import { usePageTitle } from '@acala-dapp/react-environment';
import { CouncilesTab, getCouncilType } from './CouncliTab';
import { useCouncilList } from '@acala-dapp/react-hooks';

export const CouncilDetails: FC = () => {
  usePageTitle({
    breadcrumb: [
      {
        content: 'Governance Overview',
        path: '/governance'
      }
    ],
    content: 'Council'
  });
  const councils = useCouncilList();

  const _councils = useMemo(() => {
    if (!councils) return [];

    return councils.map(getCouncilType);
  }, [councils]);

  return (
    <div>
      <CouncilesTab councils={_councils} />
    </div>
  );
};
