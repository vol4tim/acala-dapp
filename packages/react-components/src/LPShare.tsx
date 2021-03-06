import React, { FC } from 'react';
import AccountId from '@polkadot/types/generic/AccountId';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useLPShares, useAccounts } from '@acala-dapp/react-hooks';
import { FormatRatio, FormatBalance } from './format';
import { CurrencyId } from '@acala-network/types/interfaces';

interface LPShareProps extends BareProps {
  account?: AccountId | string;
  lp: CurrencyId;
  showRatio?: boolean;
}

export const LPShare: FC<LPShareProps> = ({
  account,
  lp,
  showRatio
}) => {
  const { active } = useAccounts();
  const _account = account || (active ? active.address : '');
  const shares = useLPShares(_account, lp);

  if (showRatio) {
    return (
      <FormatRatio data={shares[2]} />
    );
  }

  return (
    <FormatBalance balance={shares[0]} />
  );
};
