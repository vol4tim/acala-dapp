import React, { FC } from 'react';

import { Tabs, Card } from '@acala-dapp/ui-components';

import { RenBtcMint } from './RenBtcMint';

export const RenBtc: FC = () => {
  return (
    <Card padding={false} >
      <Tabs type='card'>
        <Tabs.Panel
          key='mint'
          tab='Mint'
        >
          <RenBtcMint />
        </Tabs.Panel>
        <Tabs.Panel
          disabled
          key='release'
          tab='Release'
        >
          <p>hello</p>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};
