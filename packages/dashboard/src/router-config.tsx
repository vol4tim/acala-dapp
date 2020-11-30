import React, { ReactElement, lazy, LazyExoticComponent, Suspense } from 'react';

import { PageLoading } from '@acala-dapp/ui-components';
import { Layout } from '@acala-dapp/react-components';

// import { MainLayout } from './layouts/Main';
import { sidebarConfig } from './sidebar-config';

export interface RouterConfigData {
  children?: RouterConfigData[];
  element?: ReactElement | LazyExoticComponent<any>;
  path: string;
  redirectTo?: string;
}

const PageDashboardHome = lazy(() => import('@acala-dapp/page-dashboard-home'));
// const PageLiquidationsCharts = lazy(() => import('@acala-dapp/page-liquidations-charts'));
const PageStablecoinOverview = lazy(() => import('@acala-dapp/page-stablecoin-overview'));
const PageOraclesCharts = lazy(() => import('@acala-dapp/page-oracles-charts'));
const PageLoanCharts = lazy(() => import('@acala-dapp/page-loan-charts'));
const PageSwapCharts = lazy(() => import('@acala-dapp/page-swap-charts'));
const PageTreasuryCharts = lazy(() => import('@acala-dapp/page-treasury-charts'));

export const config: RouterConfigData[] = [
  {
    children: [
      {
        element: <Suspense fallback={<PageLoading />}><PageDashboardHome/></Suspense>,
        path: 'home'
      },
      {
        element: <Suspense fallback={<PageLoading />}><PageStablecoinOverview/></Suspense>,
        path: 'stablecoin'
      },
      {
        element: <Suspense fallback={<PageLoading />}><PageLoanCharts/></Suspense>,
        path: 'loan'
      },
      // {
      //   element: <Suspense fallback={<PageLoading />}><PageLiquidationsCharts/></Suspense>,
      //   path: 'liquidations'
      // },
      {
        element: <Suspense fallback={<PageLoading />}><PageTreasuryCharts /></Suspense>,
        path: 'treasury'
      },
      {
        element: <Suspense fallback={<PageLoading />}><PageSwapCharts /></Suspense>,
        path: 'swap'
      },
      {
        element: <Suspense fallback={<PageLoading />}><PageOraclesCharts/></Suspense>,
        path: 'oracles'
      },
      {
        path: '*',
        redirectTo: 'home'
      }
    ],
    element: (
      <Layout.Main
        enableCollapse={false}
        sidebar={sidebarConfig}
      />
    ),
    path: '*'
  }
];
