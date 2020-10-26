import React, { FC, memo } from 'react';

import { ReactComponent as WalletIcon } from '@acala-dapp/apps/assets/wallet.svg';
import { useAccounts } from '@acala-dapp/react-hooks';
import { FormatAddress } from '@acala-dapp/react-components';

import { ProductItem } from './ProductItem';
import classes from './Sidebar.module.scss';

export const User: FC = memo(() => {
  const { active } = useAccounts();

  return (
    <div className={classes.area}>
      <ProductItem
        content={
          <div className={classes.wallet}>
            <p className={classes.name}>{active?.meta?.name || 'Wallet'}</p>
            <FormatAddress address={active?.address || ''} />
          </div>
        }
        icon={<WalletIcon />}
        path='wallet'
        rel='wallet'
      />
    </div>
  );
});

User.displayName = 'User';
