import React, { FC } from 'react';
import { Fixed18 } from '@acala-network/app-util';

import { FormatRatio } from './format';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

interface Props {
  token: CurrencyLike;
}

const YEAR = 365 * 24 * 60 * 60 * 1000;

export const DexRewardRatio: FC<Props> = ({ token }) => {

  return (
    <FormatRatio data={'00'} />
  );
};
