import React, { FC, useMemo } from 'react';

import { Fixed18 } from '@acala-network/app-util';
import { useStakingPoolHelper, useConstants } from '@acala-dapp/react-hooks';

import { FormatBalance, BalancePair, FormatBalanceProps } from './format';
import { tokenEq } from './utils';

export interface StakingPoolExchangeRateProps extends FormatBalanceProps {
  stakingAmount?: Fixed18;
  liquidAmount?: Fixed18;
  showStakingAmount?: boolean;
  showLiquidAmount?: boolean;
}

export const StakingPoolExchangeRate: FC<StakingPoolExchangeRateProps> = ({
  className,
  liquidAmount,
  showLiquidAmount = true,
  showStakingAmount = true,
  stakingAmount
}) => {
  const helper = useStakingPoolHelper();
  const { liquidCurrency, stakingCurrency } = useConstants();

  const tokenPair = useMemo<BalancePair[]>((): BalancePair[] => {
    if (!helper) return [];

    let result = [];

    if (stakingAmount) {
      result = [
        { balance: stakingAmount, currency: stakingCurrency },
        { balance: stakingAmount.mul(helper.liquidExchangeRate), currency: stakingCurrency }
      ];
    } else if (liquidAmount) {
      result = [
        { balance: liquidAmount, currency: liquidCurrency },
        { balance: liquidAmount.mul(helper.liquidExchangeRate), currency: stakingCurrency }
      ];
    } else {
      result = [
        { balance: Fixed18.fromNatural(1), currency: stakingCurrency },
        { balance: helper.liquidExchangeRate, currency: liquidCurrency }
      ];
    }

    return result.filter((item) => {
      if (showStakingAmount && tokenEq(item.currency, stakingCurrency)) {
        return true;
      }

      if (showLiquidAmount && tokenEq(item.currency, liquidCurrency)) {
        return true;
      }

      return false;
    });
  }, [helper, stakingAmount, liquidAmount, liquidCurrency, stakingCurrency, showStakingAmount, showLiquidAmount]);

  return (
    <FormatBalance
      className={className}
      pair={tokenPair}
      pairSymbol='≈'
    />
  );
};
