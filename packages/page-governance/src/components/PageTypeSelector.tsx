import React, { FC, useContext } from 'react';
import { Tabs } from '@acala-dapp/ui-components';
import { governanceContext } from './provider';
import { PageType } from './type';

export const PageTypeSelector: FC = () => {
  const { setPageType } = useContext(governanceContext);

  const handleChange = (active: string | number): void => {
    setPageType(active as PageType);
  };

  return (
    <Tabs
      onChange={handleChange}
      type='line'
    >
      <Tabs.Panel
        key='council'
        tab='Council Overview'
      />
      <Tabs.Panel
        key='motions'
        tab='Motions'
      />
    </Tabs>
  );
};
