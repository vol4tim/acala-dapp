import React, { FC, useContext, useCallback } from 'react';

import { Card, Tabs } from '@acala-dapp/ui-components';

import { StakingConsole } from './StakingConsole';
import { RedeemConsole } from './RedeemConsole';
import classes from './Console.module.scss';
import { StakingPoolContext } from './StakingPoolProvider';

export const Console: FC = () => {
  const { setAction } = useContext(StakingPoolContext);

  const handleChange = useCallback((value) => {
    setAction(value);
  }, [setAction]);

  return (
    <Card className={classes.root} >
      <Tabs
        onChange={handleChange}
        type='button'
      >
        <Tabs.Panel
          key='staking'
          tab='Mint & Stake'
        >
          <StakingConsole />
        </Tabs.Panel>
        <Tabs.Panel
          key='redeem'
          tab='Redeem'
        >
          <RedeemConsole />
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};
