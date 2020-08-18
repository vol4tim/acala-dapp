import React, { FC, useContext } from 'react';

import { Page, Grid, Condition, Tabs } from '@acala-dapp/ui-components';

import { LoanTopBar } from './components/LoanTopBar';
import { CreateConsole } from './components/CreateConsole';
import { LoanProvider, LoanContext } from './components/LoanProvider';
import { LoanConsole } from './components/LoanConsole';
import { Overview } from './components/Overview';
import { Transaction } from './components/Transaction';
import { EmergencyShutdown } from './components/emergency-shutdown';
import { WalletBalance } from '@acala-dapp/react-components';
import { LoanAlert } from './components/LoanAlert';

const Inner: FC = () => {
  const { currentTab, isShutdown } = useContext(LoanContext);

  return (
    <Page>
      <Page.Title title='Self Serviced Loan' />
      <Page.Content>
        <Grid container>
          <LoanAlert />
          <Grid item>
            <Tabs
              defaultKey={isShutdown ? 'shutdown' : 'loans'}
              type='button'
            >
              {
                <Tabs.Panel
                  disabled={!isShutdown}
                  key='shutdown'
                  tab='Emergency Shutdown'
                >
                  <EmergencyShutdown />
                </Tabs.Panel>
              }
              <Tabs.Panel
                disabled={isShutdown}
                key='loans'
                tab='My Loans'
              >
                <Grid container>
                  <Condition
                    condition={currentTab !== 'create'}
                    match={
                      <Grid item>
                        <LoanTopBar />
                      </Grid>
                    }
                  />

                  <Grid>
                    <WalletBalance />
                  </Grid>

                  <Condition
                    condition={currentTab === 'overview'}
                    match={(
                      <Grid item>
                        <Overview />
                      </Grid>
                    )}
                  />

                  <Condition
                    condition={currentTab === 'create'}
                    match={(
                      <Grid item>
                        <CreateConsole />
                      </Grid>
                    )}
                  />

                  <Condition
                    condition={currentTab !== 'create' && currentTab !== 'overview'}
                    match={(
                      <>
                        <Grid item>
                          <LoanConsole />
                        </Grid>
                        <Grid item>
                          <Transaction />
                        </Grid>
                      </>
                    )}
                  />
                </Grid>
              </Tabs.Panel>
            </Tabs>
          </Grid>
        </Grid>
      </Page.Content>
    </Page>
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
