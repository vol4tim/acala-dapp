import React, { FC } from 'react';

import { Page, Tabs, ComingSoon } from '@acala-dapp/ui-components';

import { StakingPoolProvider } from './components/StakingPoolProvider';
import { Advanced } from './components/Advanced';
import { Express } from './components/Express';

const PageHoma: FC = () => {
  return (
    <StakingPoolProvider>
      <Page>
        <Page.Title title={'Liquid Asset'} />
        <Page.Content>
          <Tabs type='button'>
            <Tabs.Panel key='express'
              tab='Express'
            >
              <Express />
            </Tabs.Panel>
            <Tabs.Panel key='advance'
              tab='Advanced'
            >
              <Advanced />
            </Tabs.Panel>
            <Tabs.Panel key='validators'
              tab='Vote For Validators'
            >
              <ComingSoon />
            </Tabs.Panel>
          </Tabs>
        </Page.Content>
      </Page>
    </StakingPoolProvider>
  );
};

export default PageHoma;
