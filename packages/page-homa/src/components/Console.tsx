import React, { FC } from 'react';

import { styled, Card, Tabs, useTabs } from '@acala-dapp/ui-components';

import { StakingConsole } from './StakingConsole';
import { RedeemConsole } from './RedeemConsole';

const CCard = styled(Card)`
  height: 100%;
  padding-top: 0;
`;

type AdvanceConsoleTabType = 'staking' | 'redeem';

export const Console: FC = () => {
  const { changeTabs, currentTab } = useTabs<AdvanceConsoleTabType>('staking');

  return (
    <CCard>
      <Tabs
        active={currentTab}
        onChange={changeTabs}
      >
        <Tabs.Panel
          $key='staking'
          tab='Mint & Stake'
        >
          <StakingConsole />
        </Tabs.Panel>
        <Tabs.Panel
          $key='redeem'
          tab='Redeem'
        >
          <RedeemConsole />
        </Tabs.Panel>
      </Tabs>
    </CCard>
  );
};
