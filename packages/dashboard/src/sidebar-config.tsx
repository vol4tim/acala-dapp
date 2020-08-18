import { ReactComponent as HomeSVG } from './assets/home.svg';
import { ReactComponent as OraclesSVG } from './assets/oracles.svg';
import { ReactComponent as StablecoinSVG } from './assets/stablecoin.svg';
import React from 'react';
import { SideBarConfig } from './types/sidebar';

export const sideBarConfig: SideBarConfig = {
  products: [
    {
      icon: <HomeSVG />,
      name: 'Home',
      path: 'home'
    },
    {
      icon: <StablecoinSVG />,
      items: [
        {
          name: 'Overview',
          path: 'stablecoin'
        },
        {
          name: 'Loans',
          path: 'loan'
        },
        {
          name: 'Liquidations',
          path: 'liquidations'
        },
        {
          name: 'Treasury',
          path: 'treasury'
        },
        {
          name: 'Swap',
          path: 'swap'
        }
      ],
      name: 'Stablecoin'
    },
    {
      icon: <OraclesSVG />,
      name: 'Oracles',
      path: 'oracles'
    }
  ]
};
