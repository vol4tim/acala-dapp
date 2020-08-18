import React, { FC, memo } from 'react';
import AccountId from '@polkadot/types/generic/AccountId';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useDexShare } from '@acala-dapp/react-hooks';
import { FormatFixed18, FormatRatio } from './format';
import { convertToFixed18 } from '@acala-network/app-util';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

interface Props extends BareProps {
  account?: AccountId | string;
  token: CurrencyLike;
  withRatio?: boolean;
}

export const DexUserShare: FC<Props> = memo(({
  account,
  token,
  withRatio = true
}) => {
  const { share, totalShares } = useDexShare(token, account);
  const _share = convertToFixed18(share || 0);
  const _totalShares = convertToFixed18(totalShares || 0);

  if (withRatio) {
    return (
      <FormatRatio
        data={_share.div(_totalShares)}
        formatNumberConfig={{
          decimalLength: 6,
          removeEmptyDecimalParts: true,
          removeTailZero: true
        }}
      />
    );
  }

  return (
    <FormatFixed18 data={_share} />
  );
});

DexUserShare.displayName = 'DexUserShare';
