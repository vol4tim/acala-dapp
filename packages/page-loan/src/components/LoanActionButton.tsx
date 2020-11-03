import React, { FC, useMemo, useCallback, ReactNode } from 'react';

import { stableCoinToDebit, Fixed18, calcLiquidationPrice, calcCollateralRatio } from '@acala-network/app-util';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { CurrencyId } from '@acala-network/types/interfaces';

import { Dialog, ButtonProps, Button, List, InlineBlockBox } from '@acala-dapp/ui-components';
import { useModal, useConstants, useBalance, useLoanHelper, useBalanceValidator } from '@acala-dapp/react-hooks';
import { BalanceInput, TxButton, FormatBalance, FormatRatio, FormatPrice, focusToFixed18, BalanceInputValue, TokenName } from '@acala-dapp/react-components';

import classes from './LoanActionButton.module.scss';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';

type ActionType = 'payback' | 'generate' | 'deposit' | 'withdraw';

interface Props extends Omit<ButtonProps, 'onClick' | 'type'> {
  type: ActionType;
  text: string;
  token: CurrencyId;
}

export const LonaActionButton: FC<Props> = ({
  text,
  token,
  type,
  ...other
}) => {
  const { close, open, status } = useModal(false);
  const { minmumDebitValue, stableCurrency } = useConstants();
  const balance = useBalance(token);
  const stableCurrencyBalance = useBalance(stableCurrency);
  const loanHelper = useLoanHelper(token);

  const maxInput = useMemo(() => {
    if (!balance || !loanHelper || !stableCurrencyBalance) return 0;

    if (type === 'payback') {
      return focusToFixed18(stableCurrencyBalance).min(loanHelper.canPayBack).toNumber(6, 3);
    }

    if (type === 'generate') {
      return loanHelper.canGenerate.toNumber(6, 3);
    }

    if (type === 'deposit') {
      return focusToFixed18(balance).toNumber(6, 3);
    }

    if (type === 'withdraw') {
      return loanHelper.collaterals.sub(loanHelper.requiredCollateral).toNumber(6, 3);
    }

    return 0;
  }, [balance, loanHelper, stableCurrencyBalance, type]);

  const isStableCurrency = useMemo((): boolean => type === 'payback' || type === 'generate', [type]);

  const isCheckBalance = useMemo(() => type === 'payback' || type === 'deposit', [type]);

  const [inputValue, setInputValue, { error, ref: inputValueRef, reset, setValidator }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: (type === 'payback' || type === 'generate') ? stableCurrency : token
  });

  useBalanceValidator({
    checkBalance: isCheckBalance,
    currency: isStableCurrency ? stableCurrency : token,
    max: [new FixedPointNumber(maxInput), ''],
    updateValidator: setValidator
  });

  const collateral = useMemo<number>((): number => {
    if (!inputValue.amount) return 0;

    if (type === 'deposit') {
      return inputValue.amount;
    }

    if (type === 'withdraw') {
      return -inputValue.amount;
    }

    return 0;
  }, [inputValue, type]);

  const debit = useMemo<number>((): number => {
    if (!inputValue.amount) return 0;

    if (type === 'generate') {
      return inputValue.amount;
    }

    if (type === 'payback') {
      return -inputValue.amount;
    }

    return 0;
  }, [inputValue, type]);

  const newLiquidationPrice = useMemo<Fixed18>(() => {
    if (!loanHelper) return Fixed18.ZERO;

    const result = calcLiquidationPrice(
      loanHelper.collaterals.add(Fixed18.fromNatural(collateral)),
      loanHelper.debitAmount.add(Fixed18.fromNatural(debit)),
      loanHelper.liquidationRatio
    );

    return result.isNaN() ? Fixed18.ZERO : result;
  }, [collateral, debit, loanHelper]);

  const newCollateralRatio = useMemo(() => {
    if (!loanHelper) return Fixed18.ZERO;

    const newDebit = loanHelper.debitAmount.add(Fixed18.fromNatural(debit));

    if (newDebit.isLessThan(Fixed18.fromNatural(1))) {
      return new Fixed18(Infinity);
    }

    return calcCollateralRatio(
      loanHelper.collaterals.add(Fixed18.fromNatural(collateral)).mul(loanHelper.collateralPrice),
      loanHelper.debitAmount.add(Fixed18.fromNatural(debit))
    );
  }, [collateral, debit, loanHelper]);

  const dialogTitle = useMemo((): ReactNode => {
    const _token = isStableCurrency ? stableCurrency : token;

    return (
      <>
        <span>{text}</span>
        <InlineBlockBox margin={8}>
          <TokenName currency={_token} />
        </InlineBlockBox>
      </>
    );
  }, [isStableCurrency, stableCurrency, text, token]);

  const handleClick = useCallback((): void => {
    open();
  }, [open]);

  const getParams = useCallback((): any[] => {
    const params = [token, '0', '0'];

    if (!inputValue.amount || !loanHelper) {
      return params;
    }

    switch (type) {
      case 'payback': {
        if (
          Fixed18.fromNatural(inputValue.amount)
            .sub(loanHelper.debitAmount)
            .negated()
            .isLessThan(minmumDebitValue)
        ) {
          params[2] = loanHelper.debits.negated().innerToString();
        } else {
          params[2] = stableCoinToDebit(
            Fixed18.fromNatural(inputValue.amount),
            loanHelper.debitExchangeRate
          ).negated().innerToString();
        }

        break;
      }

      case 'generate': {
        params[2] = stableCoinToDebit(
          Fixed18.fromNatural(inputValue.amount),
          loanHelper.debitExchangeRate
        ).innerToString();
        break;
      }

      case 'deposit': {
        params[1] = Fixed18.fromNatural(inputValue.amount).innerToString();
        break;
      }

      case 'withdraw': {
        if (
          loanHelper.collaterals
            .sub(Fixed18.fromNatural(inputValue.amount))
            .isLessThan(Fixed18.fromNatural(0.0000001))
        ) {
          params[1] = loanHelper.collaterals.negated().innerToString();
        } else {
          params[1] = Fixed18.fromNatural(inputValue.amount).negated().innerToString();
        }

        break;
      }
    }

    return params;
  }, [inputValue, loanHelper, minmumDebitValue, token, type]);

  const isDisabled = useMemo((): boolean => {
    if (error) return true;

    return !inputValue.amount;
  }, [inputValue, error]);

  const _close = (): void => {
    close();
    reset();
  };

  const formatListData = useCallback((value: Fixed18): Fixed18 => {
    return value || Fixed18.fromNatural(NaN);
  }, []);

  const handleMax = (): void => {
    setInputValue({
      amount: maxInput,
      token: inputValueRef.current.token
    });
  };

  return (
    <>
      <Button
        onClick={handleClick}
        {...other}
      >
        {text}
      </Button>
      <Dialog
        action={
          <>
            <Button
              onClick={_close}
              size='small'
              style='normal'
              type='border'
            >
              Close
            </Button>
            <TxButton
              disabled={isDisabled}
              method='adjustLoan'
              onInblock={_close}
              params={getParams()}
              section='honzon'
              size='small'
            >
              Confirm
            </TxButton>
          </>
        }
        className={classes.dialog}
        title={dialogTitle}
        visiable={status}
      >
        <BalanceInput
          error={error}
          onChange={setInputValue}
          onMax={type === 'generate' ? undefined : handleMax}
          value={inputValue}
        />
        <List
          className={classes.list}
          style='list'
        >
          <List.Item
            label='Borrowed aUSD'
            value={
              <FormatBalance balance={formatListData(loanHelper ? loanHelper.debitAmount : Fixed18.ZERO)} />
            }
          />
          <List.Item
            label='New Collateral Ratio'
            value={
              <FormatRatio data={formatListData(newCollateralRatio)} />
            }
          />
          <List.Item
            label='New Liquidation Price'
            value={
              <FormatPrice data={formatListData(newLiquidationPrice)} />
            }
          />
        </List>
      </Dialog>
    </>
  );
};
