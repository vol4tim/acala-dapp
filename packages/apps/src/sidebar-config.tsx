import React from 'react';

import { ReactComponent as DepositSVG } from '@acala-dapp/apps/assets/deposit.svg';
import { ReactComponent as TwitterSVG } from '@acala-dapp/apps/assets/twitter.svg';
import { ReactComponent as EmailSVG } from '@acala-dapp/apps/assets/email.svg';
import { ReactComponent as LoanSVG } from '@acala-dapp/apps/assets/loan.svg';
import { ReactComponent as ExchangeSVG } from '@acala-dapp/apps/assets/exchange.svg';
import { ReactComponent as GovernanceSVG } from '@acala-dapp/apps/assets/governance.svg';
import { ReactComponent as LiquidSVG } from '@acala-dapp/apps/assets/liquid.svg';
import { ReactComponent as GuideSVG } from '@acala-dapp/apps/assets/guide.svg';
import { ReactComponent as FaucetSVG } from '@acala-dapp/apps/assets/faucet.svg';

import { SideBarConfig } from './types/sidebar';

export const sideBarConfig: SideBarConfig = {
  products: [
    {
      icon: <LoanSVG />,
      name: 'Self Serviced Loan',
      path: 'loan',
      rel: 'loan'
    },
    {
      icon: <ExchangeSVG />,
      name: 'Swap',
      path: 'swap',
      rel: 'swap'
    },
    {
      icon: <DepositSVG />,
      name: 'Deposit & Earn',
      path: 'deposit',
      rel: 'deposit'
    },
    {
      icon: <LiquidSVG />,
      name: 'Liquid DOT',
      path: 'homa',
      rel: 'homa'
    },
    {
      icon: <GovernanceSVG />,
      name: 'Governance',
      path: 'governance',
      rel: 'governance'
    }
    // {
    //   icon: <LoanSVG />,
    //   name: 'Loan Analysis',
    //   path: 'anal/loan'
    // }
  ],
  socialMedia: [
    {
      icon: <FaucetSVG />,
      isExternal: true,
      name: 'Faucet',
      path: 'https://discord.gg/CmqXvMP',
      rel: 'faucet',
      target: '_blank'
    },
    {
      icon: <GuideSVG />,
      isExternal: true,
      name: 'Wiki',
      path: 'https://github.com/AcalaNetwork/Acala/wiki',
      rel: 'wiki',
      target: '_blank'
    },
    {
      icon: <EmailSVG />,
      isExternal: true,
      name: 'Email',
      path: 'mailto:hello@acala.network',
      rel: 'email',
      target: '_blank'
    },
    {
      icon: <TwitterSVG />,
      isExternal: true,
      name: 'Twitter',
      path: 'https://twitter.com/AcalaNetwork',
      rel: 'twitter',
      target: '_blank'
    }
  ]
};
