import React, { FC, useContext } from 'react';

import { Page, Grid, Condition } from '@acala-dapp/ui-components';

import { LoanTopBar } from './components/LoanTopBar';
import { CreateConsole } from './components/CreateConsole';
import { LoanProvider, LoanContext } from './components/LoanProvider';
import { LoanConsole } from './components/LoanConsole';
import { Overview } from './components/Overview';
import { Transaction } from './components/Transaction';
import { EmergencyShutdown } from './components/EmergencyShutdown';
import { WalletBalance } from '@acala-dapp/react-components';

const Inner: FC = () => {
  const { currentTab, isShutdown } = useContext(LoanContext);

  return (
    <Page>
      <Page.Title title='Self Serviced Loan' />
      <Page.Content>
        <Condition
          condition={isShutdown}
          match={<EmergencyShutdown/>}
          or={(
            <Grid container
              direction='column'>

              <Condition
                condition={currentTab !== 'create'}
                match={
                  <Grid item>
                    <LoanTopBar />
                  </Grid>
                }
              />

              <Grid item>
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
          )}
        />
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
