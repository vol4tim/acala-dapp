import React from 'react';

import { ReactComponent as DepositIcon } from '@acala-dapp/apps/assets/deposit.svg';
import { ReactComponent as TwitterIcon } from '@acala-dapp/apps/assets/twitter.svg';
import { ReactComponent as EmailIcon } from '@acala-dapp/apps/assets/email.svg';
import { ReactComponent as LoanIcon } from '@acala-dapp/apps/assets/loan.svg';
import { ReactComponent as ExchangeIcon } from '@acala-dapp/apps/assets/exchange.svg';
import { ReactComponent as LiquidIcon } from '@acala-dapp/apps/assets/liquid.svg';
import { ReactComponent as GovernanceIcon } from '@acala-dapp/apps/assets/governance.svg';
import { ReactComponent as GuideIcon } from '@acala-dapp/apps/assets/guide.svg';
import { ReactComponent as FaucetIcon } from '@acala-dapp/apps/assets/faucet.svg';
import { SidebarConfig } from '@acala-dapp/react-components/Sidebar';

export const sideBarConfig: SidebarConfig = {
  products: [
    {
      icon: <LoanIcon />,
      name: 'Borrow aUSD',
      path: 'loan'
    },
    {
      icon: <ExchangeIcon />,
      name: 'Swap',
      path: 'swap'
    },
    {
      icon: <DepositIcon />,
      name: 'Earn',
      path: 'earn'
    },
    {
      icon: <LiquidIcon />,
      name: 'Liquid Staking',
      path: 'homa'
    },
    {
      icon: <LiquidIcon />,
      name: 'Oracle Price',
      path: 'oracle-price'
    },
    {
      icon: <GovernanceIcon />,
      name: 'Governance',
      path: 'governance'
    }
  ],
  socialPlatforms: [
    {
      href: 'https://discord.gg/CmqXvMP',
      icon: <FaucetIcon />,
      name: 'Faucet',
      rel: 'faucet'
    },
    {
      href: 'https://github.com/AcalaNetwork/Acala/wiki',
      icon: <GuideIcon />,
      name: 'Wiki',
      rel: 'wiki'
    },
    {
      href: 'mailto:hello@acala.network',
      icon: <EmailIcon />,
      name: 'Email',
      rel: 'email'
    },
    {
      href: 'https://twitter.com/AcalaNetwork',
      icon: <TwitterIcon />,
      name: 'Twitter',
      rel: 'twitter'
    }
  ]
};
