import React, { FC, useEffect } from 'react';

import { Tabs, useTabs } from '@acala-dapp/ui-components';
import { SwapConsole } from './components/SwapConsole';
import { DepositConsole } from './components/DepositConsole';
import { WithdrawConsole } from './components/WithdrawConsole';
import { SwapProvider } from './components/SwapProvider';

const swapTabs = ['swap', 'add-liquidity', 'withdraw-liquidity'];

type SwapTabType = 'swap' | 'add-liquidity' | 'withdraw-liquidity';

const PageSwap: FC = () => {
  const { changeTabs, currentTab } = useTabs<SwapTabType>('swap');

  // TODO: need remove
  useEffect(() => {
    const hash = window.location.hash.replace(/.*(?=\?)/, '');
    const searchParams = new URLSearchParams(hash);
    const tab = searchParams.get('tab');

    if (tab && swapTabs.find((i) => i === tab)) {
      changeTabs(searchParams.get('tab') as SwapTabType);
    }
  }, [changeTabs]);

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
