import React, { PropsWithChildren, useEffect } from 'react';

import { useIsAppReady, useAccounts } from '@acala-dapp/react-hooks';
import { FullLoading } from '@acala-dapp/ui-components';

import { Sidebar, SideBarProps } from '../components/SideBar';
import classes from './Main.module.scss';

interface Props {
  sideBarProps: SideBarProps;
}

export const MainLayout: React.FC<PropsWithChildren<Props>> = ({ children, sideBarProps }) => {
  const { appReadyStatus } = useIsAppReady();
  const { setAuthRequired } = useAccounts();

  // Dashboard does not require accounts
  useEffect(() => {
    setAuthRequired(false);
  }, [setAuthRequired]);

  return (
    <div className={classes.root}>
      <Sidebar {...sideBarProps} />
      <div className={classes.content}>{appReadyStatus ? children : <FullLoading />}</div>
    </div>
  );
};
