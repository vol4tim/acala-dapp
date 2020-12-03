import React, { FC, lazy, Suspense } from 'react';

import { PageContentLoading } from '@acala-dapp/ui-components';

import { sideBarConfig } from './sidebar-config';
import { Layout } from '@acala-dapp/react-components';
import { RouterConfigData } from '@acala-dapp/react-environment';

const PageWallet = lazy(() => import('@acala-dapp/page-wallet'));
const PageLoan = lazy(() => import('@acala-dapp/page-loan'));
const PageHoma = lazy(() => import('@acala-dapp/page-homa'));
const PageSwap = lazy(() => import('@acala-dapp/page-swap'));
const PageOraclePrice = lazy(() => import('@acala-dapp/page-oracle-price'));
const PageIncentives = lazy(() => import('@acala-dapp/page-incentives'));
const PageGovernance = lazy(() => import('@acala-dapp/page-governance'));

const CSuspense: FC = ({ children }) => {
  // TODO: add minimal time
  return (
    <Suspense fallback={<PageContentLoading />}>
      {children}
    </Suspense>
  );
};

export const config: RouterConfigData[] = [
  {
    children: [
      {
        element: <CSuspense><PageWallet/></CSuspense>,
        path: 'wallet',
        title: 'Wallet'
      },
      {
        element: <CSuspense><PageLoan /></CSuspense>,
        path: 'loan/*',
        title: 'Borrow aUSD'
      },
      {
        element: <CSuspense><PageHoma /></CSuspense>,
        path: 'homa',
        title: 'Liquid Staking'
      },
      {
        element: <CSuspense><PageSwap /></CSuspense>,
        path: 'swap',
        title: 'Swap'
      },
      {
        element: <CSuspense><PageIncentives /></CSuspense>,
        path: 'earn',
        title: 'Earn'
      },
      {
        element: <CSuspense><PageOraclePrice /></CSuspense>,
        path: 'oracle-price',
        title: 'Oracle Price'
      },
      {
        element: <CSuspense><PageGovernance /></CSuspense>,
        path: 'governance/*',
        title: 'Governance Overview'
      },
      {
        path: '*',
        redirectTo: 'loan'
      }
    ],
    element: <Layout.Main sidebar={sideBarConfig} />,
    path: '*'
  }
];
