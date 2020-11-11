import React, { FC, useMemo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { useConstants, useLoanHelper, useBalance } from '@acala-dapp/react-hooks';
import { getTokenName, TokenImage, FormatBalance, FormatValue } from '@acala-dapp/react-components';
import { Card } from '@acala-dapp/ui-components';
import classes from './OperatorConsole.module.scss';
import { debitToStableCoin, convertToFixed18 } from '@acala-network/app-util';
import { LonaActionButton } from './LoanActionButton';

interface OperatorConsoleProps {
  currency: CurrencyId;
}

export const DebitConsole: FC<OperatorConsoleProps> = ({ currency }) => {
  const { stableCurrency } = useConstants();
  const helper = useLoanHelper(currency);
  const header = useMemo(() => `Borrowed(${getTokenName(stableCurrency)})`, [stableCurrency]);
  const isPayBackDisabled = useMemo((): boolean => {
    if (!helper) return true;

    return helper.canPayBack.isZero();
  }, [helper]);

  const isGenerateDisabled = useMemo((): boolean => {
    if (!helper) return true;

    return helper.canGenerate.isZero();
  }, [helper]);

  if (!helper) {
    return null;
  }

  return (
    <Card
      divider={false}
      header={header}
      padding={false}
    >
      <div className={classes.tokenArea}>
        <TokenImage currency={stableCurrency} />
        <FormatBalance
          balance={debitToStableCoin(helper.debits, helper.debitExchangeRate)}
          className={classes.balance}
          currency={stableCurrency}
        />
        <FormatValue
          className={classes.amount}
          data={helper.debitAmount}
        />
      </div>
      <div className={classes.actionArea}>
        <div className={classes.item}>
          <div className={classes.information}>
            <p className={classes.title}>Can Pay Back</p>
            <FormatBalance
              balance={helper.canPayBack}
              className={classes.balance}
              currency={stableCurrency}
            />
          </div>
          <LonaActionButton
            className={classes.actionBtn}
            disabled={isPayBackDisabled}
            text='Payback'
            token={currency}
            type='payback'
          />
        </div>
        <div className={classes.item}>
          <div className={classes.information}>
            <p className={classes.title}>Can Generate</p>
            <FormatBalance
              balance={helper.canGenerate}
              className={classes.balance}
              currency={stableCurrency}
            />
          </div>
          <LonaActionButton
            className={classes.actionBtn}
            disabled={isGenerateDisabled}
            text='Generate'
            token={currency}
            type='generate'
          />
        </div>
      </div>
    </Card>
  );
};

export const CollateralConsole: FC<OperatorConsoleProps> = ({ currency }) => {
  const helper = useLoanHelper(currency);
  const header = useMemo(() => `Collateral(${getTokenName(currency)})`, [currency]);
  const balance = useBalance(currency);
  const isDepositDisabled = useMemo(() => {
    if (!helper) return true;
    if (!balance) return true;

    return balance.isZero();
  }, [helper, balance]);

  const isWithdrawDisabled = useMemo(() => {
    if (!helper) return true;

    return helper.collaterals.sub(helper.requiredCollateral).isZero();
  }, [helper]);

  if (!helper) {
    return null;
  }

  return (
    <Card
      divider={false}
      header={header}
      padding={false}
    >
      <div className={classes.tokenArea}>
        <TokenImage currency={currency} />
        <FormatBalance
          balance={helper.collaterals}
          className={classes.balance}
          currency={currency}
        />
        <FormatValue
          className={classes.amount}
          data={helper.collateralAmount}
        />
      </div>
      <div className={classes.actionArea}>
        <div className={classes.item}>
          <div className={classes.information}>
            <p className={classes.title}>Required for Safety</p>
            <FormatBalance
              balance={helper.requiredCollateral}
              className={classes.balance}
              currency={currency}
            />
          </div>
          <LonaActionButton
            className={classes.actionBtn}
            disabled={isDepositDisabled}
            text='Deposit'
            token={currency}
            type='deposit'
          />
        </div>
        <div className={classes.item}>
          <div className={classes.information}>
            <p className={classes.title}>Able to Withdraw</p>
            <FormatBalance
              balance={helper.collaterals.sub(helper.requiredCollateral)}
              className={classes.balance}
              currency={currency}
            />
          </div>
          <LonaActionButton
            className={classes.actionBtn}
            disabled={isWithdrawDisabled}
            text='Withdraw'
            token={currency}
            type='withdraw'
          />
        </div>
      </div>
    </Card>
  );
};
