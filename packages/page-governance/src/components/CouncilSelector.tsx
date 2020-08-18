import React, { FC, useContext } from 'react';
import { upperFirst } from 'lodash';
import { Tabs } from '@acala-dapp/ui-components';
import { useCouncilList } from '@acala-dapp/react-hooks';
import { governanceContext } from './provider';

export const CouncilSelector: FC = () => {
  const councilList = useCouncilList();
  const { setCouncilType } = useContext(governanceContext);

  const handleChange = (active: string | number): void => {
    setCouncilType(active || '' as any);
  };

  return (
    <Tabs
      onChange={handleChange}
      type='button'
    >
      {
        councilList.map((item: string) => {
          return (
            <Tabs.Panel key={item}
              tab={upperFirst(item)}/>
          );
        })
      }
    </Tabs>
  );
};
