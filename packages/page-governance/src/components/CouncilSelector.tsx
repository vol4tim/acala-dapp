import React, { FC } from 'react';
import { upperFirst } from 'lodash';
import { Tabs, useTabs } from '@acala-dapp/ui-components';
import { useCouncilList } from '@acala-dapp/react-hooks';

export const CouncilSelector: FC = () => {
  const councilList = useCouncilList();
  const { changeTabs, currentTab } = useTabs<string>('');

  return (
    <Tabs
      active={currentTab}
      onChange={changeTabs}
    >
      {
        councilList.map((item: string) => {
          return (
            <Tabs.Panel
              $key={item}
              key={item}
              tab={upperFirst(item)}
            />
          );
        })
      }
    </Tabs>
  );
};
