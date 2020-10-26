import React, { FC, useContext } from 'react';
import { Tabs as UITabs } from '@acala-dapp/ui-components';

import { LiquidityContext } from './LiquidityProvider';
import { DepositConsole } from './DepositConsole';
import { WithdrawConsole } from './WithdrawConsole';
import classes from './Tabs.module.scss';

export const Tabs: FC = () => {
  const { activeTabs, setActiveTabs } = useContext(LiquidityContext);

  return (
    <UITabs
      defaultKey={activeTabs}
      onChange={setActiveTabs}
      tabClassName={classes.item}
      type='button'
    >
      <UITabs.Panel
        key='deposit'
        tab={'Deposit Liquidity'}
      >
        <DepositConsole />
      </UITabs.Panel>
      <UITabs.Panel
        className={classes.item}
        key='withdraw'
        tab={'Withdraw Liquidity'}
      >
        <WithdrawConsole />
      </UITabs.Panel>
    </UITabs>
  );
};
