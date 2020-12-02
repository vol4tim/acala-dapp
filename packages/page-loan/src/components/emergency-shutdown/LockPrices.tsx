import React, { FC } from 'react';
import { useLockPrices } from '@acala-dapp/react-hooks/useLockPrices';
import { FormatPrice, TokenImage, TokenName, TokenFullName, getCurrencyIdFromName } from '@acala-dapp/react-components';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useApi } from '@acala-dapp/react-hooks';

import classes from './LockPrices.module.scss';
import { ReactComponent as LockIcon } from '../../assets/lock-tag.svg';

interface PriceCardProps {
  currency: CurrencyId;
  price: FixedPointNumber;
}

const PriceCard: FC<PriceCardProps> = ({ currency, price }) => {
  return (
    <div className={classes.priceCard}>
      <div className={classes.lockTag}><LockIcon/></div>
      <TokenImage
        className={classes.assetIcon}
        currency={currency}
      />
      <div className={classes.content}>
        <div className={classes.priceContent}>
          <TokenName
            className={classes.assetName}
            currency={currency}
          />
          <FormatPrice
            className={classes.price}
            data={price}
          />
        </div>
        <TokenFullName
          className={classes.fullName}
          currency={currency}
        />
      </div>
    </div>
  );
};

export const LockPrices: FC<BareProps> = () => {
  const { api } = useApi();
  const prices = useLockPrices();

  return (
    <div className={classes.priceContainer}>
      {
        Object.keys(prices).map((currency) => {
          return (
            <PriceCard
              currency={getCurrencyIdFromName(api, currency)}
              key={`fixed-price-${currency}`}
              price={prices[currency]}
            />
          );
        })
      }
    </div>
  );
};
