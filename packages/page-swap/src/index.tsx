import React, { FC, useLayoutEffect } from 'react';
import { useParams } from 'react-router';

import { Tabs, useTabs } from '@acala-dapp/ui-components';
import { SwapConsole } from './components/SwapConsole';
import { DepositConsole } from './components/DepositConsole';
import { WithdrawConsole } from './components/WithdrawConsole';
import { SwapProvider } from './components/SwapProvider';

type SwapTabType = 'swap' | 'add-liquidity' | 'withdraw-liquidity';

const PageSwap: FC = () => {
  const { changeTabs, currentTab } = useTabs<SwapTabType>('swap');
  const params = useParams();

  useLayoutEffect(() => {
    if (params.tab) {
      changeTabs(params.tab as SwapTabType);
    }
  /* eslint-disable-next-line */
  }, []);

  return (
    <SwapProvider>
      <Tabs
        active={currentTab}
        onChange={changeTabs}
      >
        <Tabs.Panel
          $key='swap'
          header='Swap'
        >
          <SwapConsole />
        </Tabs.Panel>
        <Tabs.Panel
          $key='add-liquidity'
          header='Add Liquidity'
        >
          <DepositConsole />
        </Tabs.Panel>
        <Tabs.Panel
          $key='widthdraw-liquidity'
          header='Withdraw Liquidity'
        >
          <WithdrawConsole />
        </Tabs.Panel>
      </Tabs>
    </SwapProvider>
  );
};

export default PageSwap;
