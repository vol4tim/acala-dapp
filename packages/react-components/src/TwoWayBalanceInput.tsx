import React, { FC, useState, useCallback, useMemo, useEffect } from 'react';
import clsx from 'clsx';

import classes from './TwoWayBalanceInput.module.scss';
import { Fixed18 } from '@acala-network/app-util';

import { FormatFixed18 } from './format';
import { TokenImage, TokenName } from './Token';
import { BalanceInput, BalanceInputValue } from './BalanceInput';
import { Condition, SwitchIcon } from '@acala-dapp/ui-components';
import { useBalance } from '@acala-dapp/react-hooks';
import { focusToFixed18 } from './utils';
import { CurrencyId } from '@acala-network/types/interfaces';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';

interface TwoWayBalanceInputProps {
  className?: string;
  initCurrencies: [CurrencyId, CurrencyId];
  onChange: (num: number) => void;
  onError?: (error: boolean) => void;
  exchangeRate: Fixed18;
  swap?: boolean;
  exposeReset?: (reset: () => void) => void;
  max?: number;
}

type Direction = 'forward' | 'reverse';

export const TwoWayBalanceInput: FC<TwoWayBalanceInputProps> = ({
  className,
  exchangeRate = Fixed18.ZERO,
  exposeReset,
  initCurrencies,
  max,
  onChange,
  onError,
  swap = true
}) => {
  const [direction, setDirection] = useState<Direction>('forward');
  const [focused, setFocused] = useState<boolean>(false);
  const [primaryCurrency] = useState<CurrencyId>(initCurrencies[0]);
  const [referenceCurrency] = useState<CurrencyId>(initCurrencies[1]);
  const primaryCurrencyBalance = useBalance(primaryCurrency);

  const primaryMax = useMemo<Fixed18>((): Fixed18 => {
    const _primaryCurrencyBalance = focusToFixed18(primaryCurrencyBalance);

    if (max === undefined) return _primaryCurrencyBalance;

    const _max = Fixed18.fromNatural(max);

    return _max.min(_primaryCurrencyBalance);
  }, [max, primaryCurrencyBalance]);

  const referenceMax = useMemo<Fixed18>((): Fixed18 => {
    if (!primaryMax) return Fixed18.ZERO;

    return primaryMax.mul(exchangeRate);
  }, [primaryMax, exchangeRate]);

  const [primaryValue, setPrimarayValue] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: primaryCurrency
  });
  const [referenceValue, setReferenceValue] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: referenceCurrency
  });

  const showError = useMemo(() => {
    return '';
  }, []);

  const rootClassName = useMemo(() => {
    return clsx(classes.root, className, {
      [classes.focused]: focused,
      [classes.error]: showError
    });
  }, [showError, focused, className]);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, [setFocused]);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, [setFocused]);

  const handleSwitch = useCallback(() => {
    // does not save the state before exchange
    setPrimarayValue({
      amount: 0,
      token: primaryCurrency
    });
    setReferenceValue({
      amount: 0,
      token: referenceCurrency
    });
    onChange(0);
    setDirection(direction === 'forward' ? 'reverse' : 'forward');
  }, [setPrimarayValue, setReferenceValue, primaryCurrency, referenceCurrency, setDirection, direction, onChange]);

  const handleMax = useCallback(() => {
    if (!primaryMax) return;

    setPrimarayValue({
      amount: primaryMax.toNumber(),
      token: primaryCurrency
    });
    setReferenceValue({
      amount: referenceMax.toNumber(),
      token: referenceCurrency
    });
    onChange(primaryMax.toNumber());
  }, [setPrimarayValue, setReferenceValue, primaryMax, primaryCurrency, referenceCurrency, referenceMax, onChange]);

  const handlePrimaryChange = useCallback((value: BalanceInputValue) => {
    setPrimarayValue(value);
    setReferenceValue({
      amount: Fixed18.fromNatural(value.amount).mul(exchangeRate).toNumber(),
      token: referenceCurrency
    });
    onChange(value.amount);
  }, [setPrimarayValue, setReferenceValue, exchangeRate, referenceCurrency, onChange]);

  const handleReferenceChange = useCallback((value: BalanceInputValue) => {
    const primaryValue = Fixed18.fromNatural(value.amount).div(exchangeRate).toNumber();

    setReferenceValue(value);
    setPrimarayValue({
      amount: primaryValue,
      token: referenceCurrency
    });
    onChange(primaryValue);
  }, [setPrimarayValue, setReferenceValue, exchangeRate, referenceCurrency, onChange]);

  // expose reset action to father component
  useEffect(() => {
    if (exposeReset) {
      exposeReset(() => {
        setPrimarayValue({
          amount: 0,
          token: primaryCurrency
        });
        setReferenceValue({
          amount: 0,
          token: referenceCurrency
        });
      });
    }
  }, [exposeReset, setPrimarayValue, setReferenceValue, primaryCurrency, referenceCurrency]);

  // notify father compoent error
  useEffect(() => {
    if (onError) {
      onError(!!showError);
    }
  }, [showError, onError]);

  return (
    <div className={rootClassName}>
      <Condition condition={swap}>
        <div
          className={classes.switchArea}
          onClick={handleSwitch}
        >
          <SwitchIcon />
        </div>
      </Condition>
      <div className={classes.inputContainer}>
        <div className={classes.inputArea}>
          <BalanceInput
            border={false}
            className={classes.balanceInput}
            error={''}
            onBlur={handleBlur}
            onChange={direction === 'forward' ? handlePrimaryChange : handleReferenceChange}
            onFocus={handleFocus}
            onMax={handleMax}
            showMaxBtn
            value={direction === 'forward' ? primaryValue : referenceValue}
          />
        </div>
        <div className={classes.displayArea}>
          <FormatFixed18
            className={classes.amount}
            data={Fixed18.fromNatural((direction === 'forward' ? primaryValue.amount : referenceValue.amount) || 0)}
            prefix='≈'
          />
          <div className={classes.token}>
            <TokenImage
              className={classes.tokenImage}
              currency={direction === 'forward' ? referenceCurrency : primaryCurrency}
            />
            <TokenName
              className={classes.tokenName}
              currency={direction === 'forward' ? referenceCurrency : primaryCurrency}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
