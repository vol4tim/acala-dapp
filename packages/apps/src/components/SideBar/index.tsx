import React from 'react';

import { ApiStatus, ChainName } from '@acala-dapp/react-components';

import { Logo } from './Logo';
import { Products } from './Products';
import { SocialMedias } from './SocialMedias';
import { User } from './User';
import classes from './Sidebar.module.scss';
import { SideBarConfig } from '../../types/sidebar';

export interface SideBarProps {
  config: SideBarConfig;
}

export const Sidebar: React.FC<SideBarProps> = ({ config }) => {
  return (
    <div className={classes.root}>
      <Logo />
      <ChainName className={classes.chainName} />
      <User />
      <Products data={config.products} />
      <SocialMedias data={config.socialMedia} />
      <ApiStatus className={classes.status}/>
    </div>
  );
};
