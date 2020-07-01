import React, { ReactElement } from 'react';

import PageDeposit from '@acala-dapp/page-deposit';
import PageLoan from '@acala-dapp/page-loan';
import PageHoma from '@acala-dapp/page-homa';
import PageSwap from '@acala-dapp/page-swap';
import PageWallet from '@acala-dapp/page-wallet';
import PageGovernance from '@acala-dapp/page-governance';
import PageLoanCharts from '@acala-dapp/page-loan-charts';

import { MainLayout } from './layouts/Main';
import { sideBarConfig } from './sidebar-config';

export interface RouterConfigData {
  children?: RouterConfigData[];
  element?: ReactElement;
  path: string;
  redirectTo?: string;
}

export const config: RouterConfigData[] = [
  {
    children: [
      {
        element: <PageWallet />,
        path: 'wallet'
      },
      {
        element: <PageDeposit />,
        path: 'deposit'
      },
      {
        element: <PageLoan />,
        path: 'loan'
      },
      {
        element: <PageHoma />,
        path: 'homa'
      },
      {
        element: <PageSwap />,
        path: 'swap'
      },
      {
        element: <PageGovernance />,
        path: 'governance'
      },
      {
        element: <PageLoanCharts />,
        path: 'anal/loan'
      },
      {
        path: '*',
        redirectTo: 'loan'
      }
    ],
    element: <MainLayout sideBarProps={{ config: sideBarConfig }} />,
    path: '*'
  }
];
