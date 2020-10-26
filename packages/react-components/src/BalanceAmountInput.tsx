import React, { FC, useState, useMemo, FocusEventHandler, useCallback, useEffect } from 'react';
import clsx from 'clsx';

import { usePrice, useBalance, useConstants } from '@acala-dapp/react-hooks';
import { SwitchIcon, Condition } from '@acala-dapp/ui-components';

import classes from './BalanceAmountInput.module.scss';
import { BalanceInput, BalanceInputValue } from './BalanceInput';
import { TokenName } from './Token';
import { FormatValue } from './format';
import { CurrencyId } from '@acala-network/types/interfaces';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { LPSizeWithShare } from './LPSize';

type InputType = 'balance' | 'amount';

export interface BalanceAmountValue {
  balance: number;
  amount: number;
}
export interface BalanceAmountInputProps {
  currency: CurrencyId;
  mode?: 'token' | 'lp-token';
  onChange: (value: BalanceAmountValue) => void;
  onError?: (error: boolean) => void;
}

export const BalanceAmountInput: FC<BalanceAmountInputProps> = ({
  currency,
  mode = 'token',
  onChange,
  onError
}) => {
  const price = usePrice(currency);
  const balance = useBalance(currency);
  const { stableCurrency } = useConstants();
  const [inputType, _setInputType] = useState<InputType>('balance');
  const [focused, setFocused] = useState<boolean>(false);

  const setInputType = useCallback((value: InputType) => {
    if (mode === 'lp-token') return;

    _setInputType(value);
  }, [mode, _setInputType]);

  const maxAmount = useMemo(() => {
    if (!balance || !price) return 0;

    return balance.times(price).toNumber();
  }, [balance, price]);

  const [balanceValue, setBalanceValue] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: currency
  });

  const [amountValue, setAmountValue] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: currency
  });

  const amountForBalance = useMemo(() => {
    if (!price) return FixedPointNumber.ZERO;

    return new FixedPointNumber(balanceValue.amount || 0).times(price);
  }, [price, balanceValue]);

  const balanceForAmount = useMemo(() => {
    if (!price) return FixedPointNumber.ZERO;

    return new FixedPointNumber(amountValue.amount).div(price);
  }, [price, amountValue]);

  const handleSwitch = useCallback(() => {
    if (mode === 'lp-token') return;

    setInputType(inputType === 'amount' ? 'balance' : 'amount');
    setBalanceValue({
      amount: 0,
      token: currency
    });
    setAmountValue({
      amount: 0,
      token: stableCurrency
    });
  }, [setInputType, inputType, setBalanceValue, setAmountValue, currency, stableCurrency, mode]);

  const handleFocus: FocusEventHandler<HTMLInputElement> = () => {
    setFocused(true);
  };

  const hanleBlur: FocusEventHandler<HTMLInputElement> = () => {
    setFocused(false);
  };

  const handleBalanceMax = useCallback(() => {
    if (!balance) return;

    setBalanceValue({
      amount: balance.toNumber(18, 3),
      token: currency
    });
    console.log(balance.toNumber(18, 3), balance._getInner().toFixed(0));
    onChange({
      amount: balance.times(price).toNumber(18, 3),
      balance: balance.toNumber(18, 3)
    });
  }, [setBalanceValue, balance, currency, onChange, price]);

  const handleAmountMax = useCallback(() => {
    setAmountValue({
      amount: maxAmount || 0,
      token: stableCurrency
    });
    onChange({
      amount: maxAmount,
      balance: new FixedPointNumber(maxAmount).div(price).toNumber()
    });
  }, [maxAmount, setAmountValue, price, onChange, stableCurrency]);

  const error = useMemo(() => {
    return false;
  }, []);

  const rootClasses = useMemo(() => {
    return clsx(classes.root, {
      [classes.focused]: focused,
      [classes.error]: !!error,
      [classes.noSwitch]: mode === 'lp-token'
    });
  }, [focused, error, mode]);

  useEffect(() => {
    onError && onError(!!error);
  }, [onError, error]);

  const handleBalanceChange = useCallback((value: BalanceInputValue): void => {
    setBalanceValue(value);
    onChange({
      amount: new FixedPointNumber(value.amount).times(price).toNumber(),
      balance: value.amount
    });
  }, [setBalanceValue, onChange, price]);

  const handleAmountChange = useCallback((value: BalanceInputValue): void => {
    setAmountValue(value);
    onChange({
      amount: value.amount,
      balance: new FixedPointNumber(value.amount).div(price).toNumber()
    });
  }, [setAmountValue, onChange, price]);

  return (
    <div className={rootClasses}>
      {
        mode === 'token' ? (
          <div className={classes.switch}
            onClick={handleSwitch}
          >
            <SwitchIcon />
          </div>
        ) : null
      }
      <div className={classes.inputArea}>
        <Condition condition={inputType === 'balance'}>
          <BalanceInput
            border={false}
            className={classes.balanceInput}
            error={''}
            onBlur={hanleBlur}
            onChange={handleBalanceChange}
            onFocus={handleFocus}
            onMax={handleBalanceMax}
            showIcon={false}
            showMaxBtn
            size='small'
            value={balanceValue}
          />
          {
            mode === 'token' ? (
              <div className={classes.amountDisplay}>
                <FormatValue data={amountForBalance} />
                <TokenName currency={stableCurrency} />
              </div>
            ) : (
              <LPSizeWithShare
                className={classes.lpSize}
                lp={balanceValue.token}
                share={balanceValue.amount}
              />
            )
          }
        </Condition>
        <Condition condition={inputType === 'amount'}>
          <BalanceInput
            border={false}
            className={classes.balanceInput}
            error={''}
            id='amount'
            name='amount'
            onChange={handleAmountChange}
            onMax={handleAmountMax}
            showIcon={false}
            showMaxBtn
            size='small'
            value={amountValue}
          />
          <div className={classes.amountDisplay}>
            <FormatValue data={balanceForAmount} />
            <TokenName currency={currency} />
          </div>
        </Condition>
      </div>
    </div>
  );
};
