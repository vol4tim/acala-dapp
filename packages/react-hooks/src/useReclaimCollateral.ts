import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { Balance } from '@open-web3/orml-types/interfaces';

import { useConstants } from './useConstants';
import { useCallback, useMemo } from 'react';
import { useCall } from './useCall';
import { WithNull } from './types';
import { useTreasuryOverview } from './treasuryHooks';

type ReclaimCollateralAmount = Record<string, Fixed18>;

export interface ReclaimCollateralData {
  collaterals: WithNull<ReclaimCollateralAmount>;
  calcCanReceive: (amount: Fixed18) => ReclaimCollateralAmount;
}

export const useReclaimCollateral = (): ReclaimCollateralData => {
  const { stableCurrency } = useConstants();
  const treasury = useTreasuryOverview();
  const totalIssuance = useCall<Balance>('query.tokens.totalIssuance', [stableCurrency]);

  const collaterals = useMemo<ReclaimCollateralAmount>(() => {
    if (!treasury) return {};

    return treasury.totalCollaterals.reduce((acc, cur) => {
      acc[cur.currency.toString()] = cur.balance;

      return acc;
    }, {} as ReclaimCollateralAmount);
  }, [treasury]);

  const calcCanReceive = useCallback((amount: Fixed18): ReclaimCollateralAmount => {
    if (!totalIssuance || !collaterals) {
      return {};
    }

    const ratio = amount.div(convertToFixed18(totalIssuance));

    return Object.keys(collaterals).reduce((acc, currency) => {
      acc[currency] = (collaterals[currency] || Fixed18.ZERO).mul(ratio);

      return acc;
    }, {} as ReclaimCollateralAmount);
  }, [totalIssuance, collaterals]);

  return {
    calcCanReceive,
    collaterals
  };
};
