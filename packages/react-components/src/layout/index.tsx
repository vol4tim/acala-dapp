import React, { FC, useEffect, useMemo } from 'react';
import { useApi, useBreakpoint, useIsAppReady, useSetting } from '@acala-dapp/react-hooks';
import { styled, PageLoading, Page } from '@acala-dapp/ui-components';

import { Sidebar, SidebarConfig } from '../Sidebar';
import { useStore } from '@acala-dapp/react-environment';
import { AccountBar } from '../AccountBar';

const MainContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

interface MainLayoutProps {
  sidebar: SidebarConfig;
  enableCollapse?: boolean;
}

const Main: FC<MainLayoutProps> = ({
  children,
  enableCollapse = true,
  sidebar
}) => {
  const { init } = useApi();
  const { allEndpoints, endpoint } = useSetting();
  const screen = useBreakpoint();
  const isAppReady = useIsAppReady();
  const ui = useStore('ui');
  const collapse = useMemo(() => enableCollapse ? !(screen.xl ?? true) : false, [enableCollapse, screen]);

  useEffect(() => {
    if (!endpoint) return;

    if (isAppReady) return;

    // initialize api
    init(endpoint, allEndpoints);
  }, [init, endpoint, allEndpoints, isAppReady]);

  const content = useMemo(() => {
    if (!isAppReady) return <PageLoading />;

    return (
      <Page>
        <Page.Title
          extra={<AccountBar />}
          title={ui.pageTitle}
        />
        <Page.Content>{children}</Page.Content>
      </Page>
    );
  }, [isAppReady, ui.pageTitle, children]);

  return (
    <MainContainer>
      <Sidebar
        collapse={collapse}
        config={sidebar}
        showAccount={true}
      />
      {content}
    </MainContainer>
  );
};

const Layout = { Main };

export { Layout };
