import React, { FC, useContext } from 'react';
import { Tabs as UITabs } from '@acala-dapp/ui-components';

import { AcalaTestNet } from './AcalaTestNet';
import { NFTContext } from './NFTProvider';

export const Tabs: FC = () => {
  const { changeTabs, currentTab } = useContext(NFTContext);

  return (
    <UITabs
      defaultKey={currentTab}
      onChange={changeTabs}
      type='button'
    >
      <UITabs.Panel
        key='Acala TestNet'
        tab={'acala_testnet'}
      >
        <AcalaTestNet />
      </UITabs.Panel>
    </UITabs>
  );
};
