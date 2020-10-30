import React, { FC, FocusEventHandler, useState, ReactNode, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { FormikErrors } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@acala-dapp/ui-components/types';
import { Button, Condition, NumberInput, NumberInputProps, InlineBlockBox } from '@acala-dapp/ui-components';

import { TokenName, TokenImage } from './Token';
import { TokenSelector } from './TokenSelector';
import classes from './BalanceInput.module.scss';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { useBalance } from '@acala-dapp/react-hooks';

type BalanceInputSize = 'large' | 'middle' | 'small' | 'mini';

export type BalanceInputValue = {
  amount: number;
  token: CurrencyId;
}

export interface BalanceInputProps extends BareProps {
  checkBalance?: boolean;
  selectableTokens?: CurrencyId[];
  enableTokenSelect?: boolean;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  disabled?: boolean;
  disableTokens?: CurrencyId[];
  onChange?: (value: BalanceInputValue) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  value: BalanceInputValue;
  tokenPosition?: 'left' | 'right';
  showMaxBtn?: boolean;
  showIcon?: boolean;
  showToken?: boolean;
  size?: BalanceInputSize;
  min?: number;
  max?: number;
  onMax?: () => void;
  border?: boolean;
  numberInputProps?: Partial<NumberInputProps>;
}

export const BalanceInput: FC<BalanceInputProps> = ({
  border = true,
  className,
  checkBalance = true,
  disabled = false,
  disableTokens = [],
  enableTokenSelect = false,
  error,
  max,
  min,
  numberInputProps,
  onBlur,
  onChange,
  onFocus,
  onMax,
  placeholder,
  selectableTokens = [],
  showIcon = true,
  showMaxBtn = false,
  showToken = true,
  size = 'large',
  tokenPosition = 'right',
  value
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  const isLPToken = useMemo(() => {
    return value.token.isDexShare;
  }, [value]);
  const balance = useBalance(value.token);

  const onTokenChange = useCallback((token: CurrencyId) => {
    if (!onChange) return;

    onChange({ amount: value.amount, token });
  }, [onChange, value]);

  const onValueChange = useCallback((amount: number) => {
    if (!onChange) return;

    // hanndle check balance
    if (checkBalance && balance.isZero()) {
      return;
    }

    if (checkBalance && new FixedPointNumber(amount).isGreaterThanOrEqualTo(balance)) {
      amount = balance.toNumber();
    }

    onChange({ amount, token: value.token });
  }, [onChange, value, balance, checkBalance]);

  const renderToken = useCallback((): ReactNode => {
    if (!showToken) return null;

    return (
      <Condition
        condition={enableTokenSelect}
        match={(
          <TokenSelector
            className={
              clsx(
                classes.tokenSelector,
                classes[tokenPosition],
                {
                  [classes.showIcon]: showIcon
                }
              )
            }
            currencies={selectableTokens}
            disabledCurrencies={disableTokens}
            onChange={onTokenChange}
            showIcon={showIcon}
            value={value.token}
          />
        )}
        or={(
          <div className={clsx(classes.token, { [classes.showIcon]: showIcon })}>
            { showIcon ? <TokenImage currency={value.token} /> : null }
            <InlineBlockBox margin={8}>
              <TokenName currency={value.token} />
            </InlineBlockBox>
          </div>
        )}
      />
    );
  }, [value, disableTokens, enableTokenSelect, onTokenChange, selectableTokens, showIcon, showToken, tokenPosition]);

  const _onFocus: FocusEventHandler<HTMLInputElement> = useCallback((event) => {
    setFocused(true);
    onFocus && onFocus(event);
  }, [setFocused, onFocus]);

  const _onBlur: FocusEventHandler<HTMLInputElement> = useCallback((event) => {
    setFocused(false);
    onBlur && onBlur(event);
  }, [setFocused, onBlur]);

  const rootClasses = useMemo<string>((): string => clsx(
    className,
    classes.root,
    classes[size],
    {
      [classes.disabled]: disabled,
      [classes.border]: border,
      [classes.noToken]: !showToken,
      [classes.error]: !!error,
      [classes.focused]: focused,
      [classes.showMax]: showMaxBtn,
      [classes.showIcon]: showIcon,
      [classes.lpToken]: isLPToken
    }
  ), [className, size, disabled, border, showToken, error, focused, showMaxBtn, showIcon, isLPToken]);

  return (
    <div
      className={rootClasses}
    >
      <Condition condition={tokenPosition === 'left'}>
        {renderToken}
      </Condition>
      <NumberInput
        {...numberInputProps}
        className={classes.input}
        disabled={disabled}
        max={max}
        min={min}
        onBlur={_onBlur}
        onChange={onValueChange}
        onFocus={_onFocus}
        placeholder={placeholder}
        value={value.amount}
      />
      <Condition condition={showMaxBtn}>
        <Button
          className={classes.maxBtn}
          onClick={onMax}
          type='ghost'
        >
          MAX
        </Button>
      </Condition>
      <Condition condition={tokenPosition === 'right'}>
        {renderToken()}
      </Condition>
      <p className={clsx(classes.error, { [classes.show]: !!error })}>{error ? error.toString() : ''}</p>
    </div>
  );
};
