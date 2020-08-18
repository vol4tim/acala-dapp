import React from 'react';

import { ApiStatus } from '@acala-dapp/react-components';

import { Products } from './Products';
import { SideBarConfig } from '../../types/sidebar';
import classes from './Sidebar.module.scss';
import { Logo } from './Logo';

export interface SideBarProps {
  config: SideBarConfig;
}

export const Sidebar: React.FC<SideBarProps> = ({ config }) => {
  return (
    <div className={classes.root}>
      <Logo />
      <Products data={config.products} />
      <ApiStatus className={classes.status}/>
    </div>
  );
};
