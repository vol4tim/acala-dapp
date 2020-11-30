import React, { FC } from 'react';
import { Information } from '@acala-dapp/ui-components';

export const LiquidityInformation: FC = () => {
  return (
    <Information
      content='Liquidity Providers (LPs) earn a x.x% fee on trades proportional to their contribution share of the liquidity pool. Fees are automatically claimed when you withdraw your liquidity. Additional rewards can be earned through the LP Staking program.'
      title='Rewards for Providing Liquidity'
    />
  );
};
