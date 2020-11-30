import React, { FC } from 'react';

import { Tabs, ComingSoon, useTabs } from '@acala-dapp/ui-components';

import { StakingPoolProvider } from './components/StakingPoolProvider';
import { Advanced } from './components/Advanced';
import { Express } from './components/Express';

type HomaPageTabsType = 'express' | 'advance' | 'validators';

const PageHoma: FC = () => {
  const { changeTabs, currentTab } = useTabs<HomaPageTabsType>('express');

  return (
    <StakingPoolProvider>
      <Tabs
        active={currentTab}
        onChange={changeTabs}
      >
        <Tabs.Panel
          $key='express'
          tab='Express'
        >
          <Express />
        </Tabs.Panel>
        <Tabs.Panel
          $key='advance'
          tab='Advanced'
        >
          <Advanced />
        </Tabs.Panel>
        <Tabs.Panel
          $key='validators'
          tab='Vote For Validators'
        >
          <ComingSoon />
        </Tabs.Panel>
      </Tabs>
    </StakingPoolProvider>
  );
};

export default PageHoma;
