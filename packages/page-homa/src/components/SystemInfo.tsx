import React, { FC, useContext } from 'react';

import { Card, List } from '@acala-dapp/ui-components';
import { FormatRatio, FormatBalance } from '@acala-dapp/react-components';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

import { StakingPoolContext } from './StakingPoolProvider';

export const SystemInfo: FC = () => {
  const { stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);

  if (!stakingPoolHelper || !stakingPool) {
    return null;
  }

  return (
    <Card header='System Info'
      padding={false}>
      <List style='list'>
        <List.Item
          label='Exchange Rate'
          value={
            <FormatBalance
              pair={[
                {
                  balance: Fixed18.fromNatural(1),
                  currency: stakingPool.stakingCurrency
                },
                {
                  balance: Fixed18.fromNatural(1).div(stakingPoolHelper.liquidExchangeRate),
                  currency: stakingPool.liquidCurrency

                }
              ]}
              pairSymbol='≈'
            />
          }
        />
        <List.Item
          label='Max Bonding Ratio'
          value={
            <FormatRatio data={convertToFixed18(stakingPool.maxBondRatio)} />
          }
        />
        <List.Item
          label='Min Bonding Ratio'
          value={
            <FormatRatio data={convertToFixed18(stakingPool.minBondRatio)} />
          }
        />
      </List>
    </Card>
  );
};
