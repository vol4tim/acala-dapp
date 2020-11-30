import React from 'react';

import { ReactComponent as DepositSVG } from '@acala-dapp/apps/assets/deposit.svg';
import { ReactComponent as TwitterSVG } from '@acala-dapp/apps/assets/twitter.svg';
import { ReactComponent as EmailSVG } from '@acala-dapp/apps/assets/email.svg';
import { ReactComponent as LoanSVG } from '@acala-dapp/apps/assets/loan.svg';
import { ReactComponent as ExchangeSVG } from '@acala-dapp/apps/assets/exchange.svg';
import { ReactComponent as LiquidSVG } from '@acala-dapp/apps/assets/liquid.svg';
import { ReactComponent as GuideSVG } from '@acala-dapp/apps/assets/guide.svg';
import { ReactComponent as FaucetSVG } from '@acala-dapp/apps/assets/faucet.svg';
import { SidebarConfig } from '@acala-dapp/react-components/Sidebar';

export const sideBarConfig: SidebarConfig = {
  products: [
    {
      icon: <LoanSVG />,
      name: 'Borrow aUSD',
      path: 'loan'
    },
    {
      icon: <ExchangeSVG />,
      name: 'Swap',
      path: 'swap'
    },
    {
      icon: <DepositSVG />,
      name: 'Earn',
      path: 'earn'
    },
    {
      icon: <LiquidSVG />,
      name: 'Liquid Staking',
      path: 'homa'
    },
    {
      icon: <LiquidSVG />,
      name: 'Oracle Price',
      path: 'oracle-price'
    }
    // {
    //   content: 'Governance',
    //   icon: <GovernanceSVG />,
    //   path: 'governance',
    //   rel: 'governance'
    // }
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
