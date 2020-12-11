import React, { FC } from 'react';
import clsx from 'clsx';

import { CurrencyId } from '@acala-network/types/interfaces';
import { UserAssetBalance, UserAssetValue, TokenImage, TokenName, TransferButton, tokenEq, StakingPoolExchangeRate, focusToFixed18 } from '@acala-dapp/react-components';
import { Condition } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useConstants, useBalance, useLPCurrencies } from '@acala-dapp/react-hooks';

import classes from './TokenBalances.module.scss';

interface LPCardProps extends BareProps {
  currency: CurrencyId;
}

const LPCard: FC<LPCardProps> = ({ className, currency }) => {
  const { liquidCurrency } = useConstants();
  const liquidBalance = useBalance(liquidCurrency);

  return (
    <div className={clsx(className, classes.assetCard)}>
      <div className={classes.inner}></div>
      <div className={classes.header}>
        <TokenImage
          className={classes.lpTokenImage}
          currency={currency}
        />
        <div className={classes.tokenArea}>
          <TokenName
            className={classes.name}
            currency={currency}
          />
        </div>
        <div className={classes.balanceArea}>
          <UserAssetBalance
            className={classes.currency}
            currency={currency}
          />
          <Condition
            condition={tokenEq(currency, liquidCurrency)}
            or={
              <UserAssetValue
                className={classes.amount}
                currency={currency}
              />
            }>
            <StakingPoolExchangeRate
              className={classes.amount}
              liquidAmount={focusToFixed18(liquidBalance)}
              showLiquidAmount={false}
            />
          </Condition>
        </div>
      </div>
      <TransferButton
        className={classes.transferBtn}
        currency={currency}
        mode='lp-token'
      />
    </div>
  );
};

export const LPBalances: FC = () => {
  const allLPTokens = useLPCurrencies();

  return (
    <div className={classes.root}>
      {
        allLPTokens.map((currency: CurrencyId): JSX.Element => (
          <LPCard
            className={classes.item}
            currency={currency}
            key={`asset-card-${currency.toString()}`}
          />
        ))
      }
    </div>
  );
};
