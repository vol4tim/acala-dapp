import { ReactElement } from 'react';

export interface SideBarItem {
  icon?: ReactElement;
  path?: string;
  target?: string;
  href?: string;
  isExternal?: boolean;
  items?: SideBarItem[];
}

export interface SideBarConfig {
  products: SideBarItem[];
  socialMedia?: SideBarItem[];
}
