import React, { FC, useContext } from 'react';

import { useConstants } from '@acala-dapp/react-hooks';
import { TokenImage, TokenName, UserAssetValue, TokenFullName, Token, FormatBalance } from '@acala-dapp/react-components';

import classes from './ReClaimCollaterals.module.scss';
import { EmergencyShutdownContext } from './EmergencyShutdownProvider';

const MyLoan: FC = () => {
  const { stableCurrency } = useConstants();

  return (
    <div className={classes.card}>
      <p className={classes.title}>My Loans</p>

      <div className={classes.assetCard}>
        <TokenImage
          className={classes.assetToken}
          currency={stableCurrency}
        />
        <div className={classes.content}>
          <div className={classes.priceContent}>
            <TokenName
              className={classes.assetName}
              currency={stableCurrency}
            />
            <UserAssetValue
              className={classes.number}
              currency={stableCurrency}
            />
          </div>
          <TokenFullName
            className={classes.fullname}
            currency={stableCurrency}
          />
        </div>
      </div>
    </div>
  );
};

const BasketCollateral: FC = () => {
  const { collaterals } = useContext(EmergencyShutdownContext);

  return (
    <div className={classes.card}>
      <p className={classes.title}>You will get</p>
      <div className={classes.basketCard}>
        <ul>
          {
            Object.keys(collaterals).map((currency) => {
              return (
                <li
                  className={classes.item}
                  key={`collateral-${currency}`}
                >
                  <Token
                    currency={currency}
                    icon
                    imageClassName={classes.img}
                  />
                  <FormatBalance
                    balance={collaterals[currency]}
                    currency={currency}
                  />
                </li>
              );
            })
          }
        </ul>
      </div>
    </div>
  );
};

export const ReclaimCollateral: FC = () => {
  return (
    <div className={classes.main}>
      <MyLoan />
      <BasketCollateral />
    </div>
  );
};
