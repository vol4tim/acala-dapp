import React, { FC, ReactElement } from 'react';
import clsx from 'clsx';

import { useConstants } from '@acala-dapp/react-hooks';
import { AssetBalance, AssetAmount, TotalAssetAmount, TokenImage, TokenName, TokenFullName, TransferButton } from '@acala-dapp/react-components';
import { BareProps } from '@acala-dapp/ui-components/types';
import { CurrencyId } from '@acala-network/types/interfaces';

import classes from './WalletBalance.module.scss';

const TotalAsset: FC<BareProps> = ({ className }) => {
  return (
    <div className={clsx(className, classes.totalAsset)}>
      <p>My Assets</p>
      <TotalAssetAmount className={classes.num} />
    </div>
  );
};

interface AssetCardProps extends BareProps {
  currency: CurrencyId;
}

const AssetCard: FC<AssetCardProps> = ({ className, currency }) => {
  return (
    <div className={clsx(className, classes.assetCard)}>
      <div className={classes.header}>
        <TokenImage
          className={classes.tokenImage}
          currency={currency}
        />
        <div className={classes.tokenArea}>
          <TokenName
            className={classes.name}
            currency={currency}
          />
          <TokenFullName
            className={classes.fullname}
            currency={currency}
          />
        </div>
        <div className={classes.balanceArea}>
          <AssetBalance
            className={classes.currency}
            currency={currency}
          />
          <AssetAmount
            className={classes.amount}
            currency={currency}
            prefix='≈US$'
          />
        </div>
      </div>
      <TransferButton
        className={classes.transferBtn}
        currency={currency}
      />
    </div>
  );
};

export const WalletBalance: FC = () => {
  const { allCurrencies } = useConstants();

  return (
    <div className={classes.root}>
      <TotalAsset className={classes.item}/>
      {
        allCurrencies.map((currency: CurrencyId): ReactElement => (
          <AssetCard
            className={classes.item}
            currency={currency}
            key={`asset-card-${currency.toString()}`}
          />
        ))
      }
    </div>
  );
};
