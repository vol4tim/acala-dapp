import React from 'react';
import { ReactComponent as HomeSVG } from './assets/home.svg';
import { ReactComponent as OraclesSVG } from './assets/oracles.svg';
import { ReactComponent as StablecoinSVG } from './assets/stablecoin.svg';
import { ReactComponent as TwitterSVG } from '@acala-dapp/apps/assets/twitter.svg';
import { ReactComponent as EmailSVG } from '@acala-dapp/apps/assets/email.svg';
import { ReactComponent as GuideSVG } from '@acala-dapp/apps/assets/guide.svg';
import { ReactComponent as FaucetSVG } from '@acala-dapp/apps/assets/faucet.svg';
import { SidebarConfig } from '@acala-dapp/react-components/Sidebar';

export const sidebarConfig: SidebarConfig = {
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
  ],
  socialPlatforms: [
    {
      href: 'https://discord.gg/CmqXvMP',
      icon: <FaucetSVG />,
      name: 'Faucet',
      rel: 'faucet'
    },
    {
      href: 'https://github.com/AcalaNetwork/Acala/wiki',
      icon: <GuideSVG />,
      name: 'Wiki',
      rel: 'wiki'
    },
    {
      href: 'mailto:hello@acala.network',
      icon: <EmailSVG />,
      name: 'Email',
      rel: 'email'
    },
    {
      href: 'https://twitter.com/AcalaNetwork',
      icon: <TwitterSVG />,
      name: 'Twitter',
      rel: 'twitter'
    }
  ]
};
