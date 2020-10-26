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
      content: 'Self Serviced Loan',
      icon: <LoanSVG />,
      path: 'loan',
      rel: 'loan'
    },
    {
      content: 'Swap',
      icon: <ExchangeSVG />,
      path: 'swap',
      rel: 'swap'
    },
    {
      content: 'Deposit',
      icon: <DepositSVG />,
      path: 'liquidity',
      rel: 'liquidity'
    },
    {
      content: 'AMM',
      icon: <DepositSVG />,
      path: 'incentives',
      rel: 'incentives'
    },
    {
      content: 'Liquid DOT',
      icon: <LiquidSVG />,
      path: 'homa',
      rel: 'homa'
    },
    {
      content: 'Governance',
      icon: <GovernanceSVG />,
      path: 'governance',
      rel: 'governance'
    }
    // {
    //   icon: <LoanSVG />,
    //   content: 'Loan Analysis',
    //   path: 'anal/loan'
    // }
  ],
  socialMedia: [
    {
      content: 'Faucet',
      icon: <FaucetSVG />,
      isExternal: true,
      path: 'https://discord.gg/CmqXvMP',
      rel: 'faucet',
      target: '_blank'
    },
    {
      content: 'Wiki',
      icon: <GuideSVG />,
      isExternal: true,
      path: 'https://github.com/AcalaNetwork/Acala/wiki',
      rel: 'wiki',
      target: '_blank'
    },
    {
      content: 'Email',
      icon: <EmailSVG />,
      isExternal: true,
      path: 'mailto:hello@acala.network',
      rel: 'email',
      target: '_blank'
    },
    {
      content: 'Twitter',
      icon: <TwitterSVG />,
      isExternal: true,
      path: 'https://twitter.com/AcalaNetwork',
      rel: 'twitter',
      target: '_blank'
    }
  ]
};
