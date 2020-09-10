import React, { FC } from 'react';

import { Page } from '@acala-dapp/ui-components';
import { useApi } from '@acala-dapp/react-hooks';

import { Consts } from './components/Consts';

const PageDeposit: FC = () => {
  const { api } = useApi();

  console.log(api);

  return (
    <Page fullscreen>
      <Page.Title title='System Constants' />
      <Page.Content>
        <Consts />
      </Page.Content>
    </Page>
  );
};

export default PageDeposit;
