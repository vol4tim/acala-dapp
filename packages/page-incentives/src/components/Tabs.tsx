import React, { FC, useContext } from 'react';
import { Tabs as UITabs } from '@acala-dapp/ui-components';

import { IncentivesContext } from './IncentivesProvider';

import classes from './Tabs.module.scss';
import { LoansReward } from './HonzonIncentivesReward';
import { LPIncentivesReward } from './LPIncentivesReward';

export const Tabs: FC = () => {
  const { activeTabs, setActiveTabs } = useContext(IncentivesContext);

  return (
    <UITabs
      defaultKey={activeTabs}
      onChange={setActiveTabs}
      tabClassName={classes.item}
      type='button'
    >
      <UITabs.Panel
        key='honzon-incentives'
        tab={'Honzon Reward'}
      >
        <LoansReward />
      </UITabs.Panel>
      <UITabs.Panel
        className={classes.item}
        key='dex-incentives'
        tab={'LP Reward'}
      >
        <LPIncentivesReward />
      </UITabs.Panel>
    </UITabs>
  );
};
