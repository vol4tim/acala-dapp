import AccountId from '@polkadot/types/generic/AccountId';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';
import { Balance } from '@polkadot/types/interfaces';

import { useCall } from './useCall';
import { useDexShare } from './useDexShare';
import { useAccounts } from './useAccounts';
import { useConstants } from './useConstants';
import { CurrencyLike } from './types';

interface DexRewardData {
  amount: number;
  token: CurrencyLike;
  rewardRatio: Fixed18;
}

export const useDexReward = (token: CurrencyLike, account?: AccountId | string): DexRewardData => {
  const { active } = useAccounts();
  const _account = account || (active ? active.address : '');
  const totalInterest = useCall<[Balance, Balance]>('query.dex.totalInterest', [token]);
  const { share, totalShares } = useDexShare(token, _account);
  const withdrawnInterest = useCall<Balance>('query.dex.withdrawnInterest', [token, _account]);
  const liquidityIncentiveRate = useCall<Balance>('query.dex.liquidityIncentiveRate', [token]);
  const { dexBaseCurrency } = useConstants();

  let amount = 0;

  if (totalInterest && share && totalShares) {
    const _totalInterest = convertToFixed18(totalInterest[0]);
    const _share = convertToFixed18(share);
    const _totalShares = convertToFixed18(totalShares);
    const _withdrawnInterest = convertToFixed18(withdrawnInterest || 0);

    amount = _share.div(_totalShares).mul(_totalInterest).sub(_withdrawnInterest).toNumber();
  }

  return {
    amount,
    rewardRatio: convertToFixed18(liquidityIncentiveRate || 0).div(Fixed18.fromNatural(2)),
    token: dexBaseCurrency
  };
};
