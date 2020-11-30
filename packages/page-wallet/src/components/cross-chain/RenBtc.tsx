import React, { FC } from 'react';

import { Card, Tabs, useTabs, CardTabTitle } from '@acala-dapp/ui-components';

import { RenBtcMint } from './RenBtcMint';

type RenBTCTabType = 'mint' | 'release';

export const RenBtc: FC = () => {
  const { changeTabs, currentTab } = useTabs<RenBTCTabType>('mint');

  return (
    <Card padding={false}>
      <Tabs<RenBTCTabType>
        active={currentTab}
        onChange={changeTabs}
        showTabsContainerBorderLine={false}
      >
        <Tabs.Panel
          $key='mint'
          tab={(): JSX.Element => (
            <CardTabTitle
              active={currentTab === 'mint'}
              disabled={false}
            >
              Mint
            </CardTabTitle>
          )}
        >
          <RenBtcMint />
        </Tabs.Panel>
        <Tabs.Panel
          $key='release'
          tab={(): JSX.Element => (
            <CardTabTitle
              active={currentTab === 'release'}
              disabled={true}
            >
              Release
            </CardTabTitle>
          )}
        >
          <p>hello</p>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};
