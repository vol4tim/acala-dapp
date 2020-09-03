import React from 'react';

import { ApiStatus, UploadMetadata } from '@acala-dapp/react-components';

import { Logo } from './Logo';
import { Products } from './Products';
import { SocialMedias } from './SocialMedias';
import { User } from './User';
import { SideBarConfig } from '../../types/sidebar';
import classes from './Sidebar.module.scss';

export interface SideBarProps {
  config: SideBarConfig;
}

export const Sidebar: React.FC<SideBarProps> = ({ config }) => {
  return (
    <div className={classes.root}>
      <Logo />
      <User />
      <Products data={config.products} />
      <SocialMedias data={config.socialMedia} />
      <UploadMetadata />
      <ApiStatus className={classes.status} />
    </div>
  );
};
