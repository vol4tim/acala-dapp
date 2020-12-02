import React, { FC, useContext } from 'react';

import { Row, Col, Condition, Tabs, useTabs } from '@acala-dapp/ui-components';

import { LoanTopBar } from './components/LoanTopBar';
import { CreateConsole } from './components/CreateConsole';
import { LoanProvider, LoanContext } from './components/LoanProvider';
import { LoanConsole } from './components/LoanConsole';
import { Overview } from './components/Overview';
import { EmergencyShutdown } from './components/emergency-shutdown';
import { WalletBalance } from '@acala-dapp/react-components';
import { LoanAlert } from './components/LoanAlert';

type LoanTabType = 'shutdown' | 'loans';

const Inner: FC = () => {
  const { currentTab, isShutdown } = useContext(LoanContext);
  const { changeTabs, currentTab: pageCurrentTab } = useTabs<LoanTabType>(isShutdown ? 'shutdown' : 'loans');

  return (
    <Row gutter={[24, 24]}>
      <LoanAlert />
      <Col span={24}>
        <Tabs<LoanTabType>
          active={pageCurrentTab}
          onChange={changeTabs}
        >
          <Tabs.Panel
            $key='loans'
            disabled={isShutdown}
            header='My Loans'
          >
            <Row gutter={[24, 24]}>
              <Condition
                condition={currentTab !== 'create'}
                match={
                  <Col span={24}>
                    <LoanTopBar />
                  </Col>
                }
              />

              <Col span={24}>
                <WalletBalance />
              </Col>

              <Condition
                condition={currentTab === 'overview'}
                match={(
                  <Col span={24}>
                    <Overview />
                  </Col>
                )}
              />

              <Condition
                condition={currentTab === 'create'}
                match={(
                  <Col span={24}>
                    <CreateConsole />
                  </Col>
                )}
              />

              <Condition
                condition={currentTab !== 'create' && currentTab !== 'overview'}
                match={(
                  <>
                    <Col span={24}>
                      <LoanConsole />
                    </Col>
                  </>
                )}
              />
            </Row>
          </Tabs.Panel>
          <Tabs.Panel
            $key='shutdown'
            disabled={!isShutdown}
            header='Emergency Shutdown'
          >
            <EmergencyShutdown />
          </Tabs.Panel>
        </Tabs>
      </Col>
    </Row>
  );
};

const PageLoan: FC = () => {
  return (
    <LoanProvider>
      <Inner />
    </LoanProvider>
  );
};

export default PageLoan;
