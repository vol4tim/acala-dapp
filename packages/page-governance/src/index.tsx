import React, { FC } from 'react';

import { Page, Row, Col } from '@acala-dapp/ui-components';

import { GovernanceProvider } from './components/provider';
import { PageTypeSelector } from './components/PageTypeSelector';
import { CouncilSelector } from './components/CouncilSelector';
import { Content } from './components/Content';

const PageWallet: FC = () => {
  return (
    <Page>
      <Page.Title title='Governance' />
      <Page.Content>
        <GovernanceProvider>
          <Row>
            <Col span={24}>
              <PageTypeSelector />
            </Col>
            <Col span={24}>
              <CouncilSelector />
            </Col>
            <Col span={24}>
              <Content />
            </Col>
          </Row>
        </GovernanceProvider>
      </Page.Content>
    </Page>
  );
};

export default PageWallet;
