import React, { FC } from 'react';

import { styled, Card, Tabs, useTabs } from '@acala-dapp/ui-components';

import { StakingConsole } from './StakingConsole';
import { RedeemConsole } from './RedeemConsole';

const CCard = styled(Card)`
  height: 100%;

  & > .card__content {
    padding: 0;
  }
`;

const Content = styled.div`
  padding: 0 24px;
`;

type AdvanceConsoleTabType = 'staking' | 'redeem';

export const Console: FC = () => {
  const { changeTabs, currentTab } = useTabs<AdvanceConsoleTabType>('staking');

  return (
    <CCard>
      <Tabs
        active={currentTab}
        divider={false}
        onChange={changeTabs}
      >
        <Tabs.Panel
          $key='staking'
          header='Mint & State'
        >
          <Content>
            <StakingConsole />
          </Content>
        </Tabs.Panel>
        <Tabs.Panel
          $key='redeem'
          header='Redeem'
        >
          <Content>
            <RedeemConsole />
          </Content>
        </Tabs.Panel>
      </Tabs>
    </CCard>
  );
};
