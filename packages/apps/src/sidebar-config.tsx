import React from 'react';

import { ReactComponent as DepositSVG } from '@acala-dapp/apps/assets/deposit.svg';
import { ReactComponent as TwitterSVG } from '@acala-dapp/apps/assets/twitter.svg';
import { ReactComponent as EmailSVG } from '@acala-dapp/apps/assets/email.svg';
import { ReactComponent as LoanSVG } from '@acala-dapp/apps/assets/loan.svg';
import { ReactComponent as ExchangeSVG } from '@acala-dapp/apps/assets/exchange.svg';
import { ReactComponent as GovernanceSVG } from '@acala-dapp/apps/assets/governance.svg';
import { ReactComponent as LiquidSVG } from '@acala-dapp/apps/assets/liquid.svg';

import { SideBarConfig } from './types/sidebar';

export const sideBarConfig: SideBarConfig = {
  products: [
    {
      icon: <LoanSVG />,
      name: 'Self Serviced Loan',
      path: 'loan'
    },
    {
      icon: <ExchangeSVG />,
      name: 'Swap',
      path: 'swap'
    },
    {
      icon: <DepositSVG />,
      name: 'Deposit & Earn',
      path: 'deposit'
    },
    {
      icon: <LiquidSVG />,
      name: 'Liquid DOT',
      path: 'homa'
    },
    {
      icon: <GovernanceSVG />,
      name: 'Governance',
      path: 'governance'
    },
    {
      icon: <LoanSVG />,
      name: 'Loan Analysis',
      path: 'anal/loan'
    }
  ],
  socialMedia: [
    {
      icon: <EmailSVG />,
      isExternal: true,
      name: 'Email',
      path: 'mailto:hello@acala.network',
      target: '_blank'
    },
    {
      icon: <TwitterSVG />,
      isExternal: true,
      name: 'Twitter',
      path: 'https://twitter.com/AcalaNetwork',
      target: '_blank'
    }
  ]
};
