import React, { FC, ReactNode } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';

import { ScrollCard, Condition } from '@acala-dapp/ui-components';
import { useConstants, useBalance } from '@acala-dapp/react-hooks';
import { TokenImage, TokenName, UserAssetBalance, UserAssetValue, tokenEq, StakingPoolExchangeRate } from '@acala-dapp/react-components';

import classes from './WalletBalance.module.scss';
import { BareProps } from '@acala-dapp/ui-components/types';

interface BalanceProps extends BareProps {
  currency: CurrencyId;
}

export const Balance: FC<BalanceProps> = ({ className, currency }) => {
  const { liquidCurrency } = useConstants();
  const liquidBalance = useBalance(liquidCurrency);

  return (
    <div className={className}>
      <TokenImage
        className={classes.image}
        currency={currency}
      />
      <div className={classes.content}>
        <TokenName
          className={classes.name}
          currency={currency}
        />
        <UserAssetBalance
          className={classes.balance}
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
            liquidAmount={liquidBalance}
            showLiquidAmount={false}
          />
        </Condition>
      </div>
    </div>
  );
};

export const WalletBalance: FC = () => {
  const { allCurrencies } = useConstants();

  return (
    <ScrollCard
      contentClassName={classes.cardContent}
      divider={false}
      header='Wallet Balance'
      itemClassName={classes.item}
      padding={false}
    >
      {
        allCurrencies.map((currency: CurrencyId): ReactNode => (
          <ScrollCard.Item
            instance={(
              <Balance
                currency={currency}
              />
            )}
            key={`wallet-balance-${currency.toString()}`}
          />
        ))
      }
    </ScrollCard>
  );
};
