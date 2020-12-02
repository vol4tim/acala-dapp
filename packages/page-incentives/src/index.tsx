import React, { FC } from 'react';

import { Tabs, useTabs } from '@acala-dapp/ui-components';

import { IncentivesProvider } from './components/IncentivesProvider';
import { LoansReward } from './components/LoanReward';
import { LPIncentivesReward } from './components/LPIncentivesReward';

type IncentiveTabType = 'lp-staking' | 'distribution-program';

const PageDeposit: FC = () => {
  const { changeTabs, currentTab } = useTabs<IncentiveTabType>('lp-staking');

  return (
    <IncentivesProvider>
      <Tabs<IncentiveTabType>
        active={currentTab}
        onChange={changeTabs}
      >
        <Tabs.Panel
          $key='lp-staking'
          header='LP Staking'
        >
          <LPIncentivesReward />
        </Tabs.Panel>
        <Tabs.Panel
          $key='distribution-program'
          header='Distribution Program'
        >
          <LoansReward />
        </Tabs.Panel>
      </Tabs>
    </IncentivesProvider>
  );
};

export default PageDeposit;
