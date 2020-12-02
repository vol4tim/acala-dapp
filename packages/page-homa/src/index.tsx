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
          header='Express'
        >
          <Express />
        </Tabs.Panel>
        <Tabs.Panel
          $key='advance'
          header='Advanced'
        >
          <Advanced />
        </Tabs.Panel>
        <Tabs.Panel
          $key='validators'
          header='Vote For Validators'
        >
          <ComingSoon />
        </Tabs.Panel>
      </Tabs>
    </StakingPoolProvider>
  );
};

export default PageHoma;
