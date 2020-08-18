import React, { FC } from 'react';
import { useDexReward, useApi } from '@acala-dapp/react-hooks';
import { Fixed18 } from '@acala-network/app-util';

import { FormatRatio } from './format';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

interface Props {
  token: CurrencyLike;
}

const YEAR = 365 * 24 * 60 * 60 * 1000;

export const DexRewardRatio: FC<Props> = ({ token }) => {
  const { api } = useApi();
  const { rewardRatio } = useDexReward(token);
  const expectedBlockTime = api.consts.babe.expectedBlockTime.toNumber();
  const rewardRatioYEAR = rewardRatio.mul(Fixed18.fromNatural((YEAR / expectedBlockTime)));

  return (
    <FormatRatio data={rewardRatioYEAR} />
  );
};
