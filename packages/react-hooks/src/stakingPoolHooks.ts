import { useState, useEffect, useMemo } from 'react';

import { StakingPoolHelper, Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { Rate, BlockNumber } from '@acala-network/types/interfaces';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { useRxStore } from './useRxStore';
import { useBalance, useIssuance } from './balanceHooks';
import { useConstants } from './useConstants';
import { usePrice } from './priceHooks';

export const useStakingPoolHelper = (): StakingPoolHelper | null => {
  const [stakingPoolHelper, setStakingPoolHelper] = useState<StakingPoolHelper | null>(null);
  const { stakingPool: stakingPoolStore } = useRxStore();

  useEffect(() => {
    const subscribe = stakingPoolStore.subscribe((result) => {
      setStakingPoolHelper(result.helper);
    });

    return (): void => subscribe.unsubscribe();
  }, [stakingPoolStore, setStakingPoolHelper]);

  return stakingPoolHelper;
};

/**
 * @name useStakingAmount
 * @description get address`s staking asset balance
 */
export const useStakingTotalAmount = (): Fixed18 => {
  const stakingPoolHelper = useStakingPoolHelper();
  const { liquidCurrency } = useConstants();
  const liquidBalance = useBalance(liquidCurrency);
  const liquidIssuance = useIssuance(liquidCurrency);

  const ratio = useMemo<Fixed18>(() => {
    if (!liquidBalance || !liquidIssuance || liquidIssuance.isZero()) return Fixed18.ZERO;

    return convertToFixed18(liquidBalance).div(liquidIssuance);
  }, [liquidBalance, liquidIssuance]);

  const totalAmount = useMemo<Fixed18>((): Fixed18 => {
    if (!stakingPoolHelper) return Fixed18.ZERO;

    return stakingPoolHelper.communalTotal.mul(ratio);
  }, [stakingPoolHelper, ratio]);

  return totalAmount;
};

/**
 * @name useStakingValue
 * @description get address`s staking asset value
 */
export const useStakingValue = (): Fixed18 => {
  const amount = useStakingTotalAmount();
  const { stakingCurrency } = useConstants();
  const price = usePrice(stakingCurrency);

  const value = useMemo<Fixed18>(() => {
    if (!price || !amount) return Fixed18.ZERO;

    return amount.mul(price);
  }, [amount, price]);

  return value;
};

const YEAR = 365 * 24 * 60 * 60 * 1000;

export const useStakingRewardAPR = (): Fixed18 => {
  const { api } = useApi();
  const rewardRate = useCall<Rate>('query.polkadotBridge.mockRewardRate', []);

  const arp = useMemo<Fixed18>(() => {
    if (!rewardRate) return Fixed18.ZERO;

    const eraLength = (api.consts.polkadotBridge.eraLength as unknown as BlockNumber).toNumber();
    const expectedBlockTime = api.consts.babe.expectedBlockTime.toNumber();
    const eraNumOfYear = YEAR / expectedBlockTime / eraLength;

    return convertToFixed18(rewardRate).mul(Fixed18.fromNatural(eraNumOfYear));
  }, [api, rewardRate]);

  return arp;
};
