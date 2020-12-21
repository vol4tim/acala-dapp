import React, { FC, FocusEventHandler, useState, ReactNode, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { FormikErrors } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@acala-dapp/ui-components/types';
import { Button, Condition, NumberInput, NumberInputProps, InlineBlockBox, styled } from '@acala-dapp/ui-components';

import { TokenName, TokenImage } from './Token';
import { TokenSelector } from './TokenSelector';
import classes from './BalanceInput.module.scss';

type BalanceInputSize = 'large' | 'middle' | 'small' | 'mini';

export type BalanceInputValue = {
  amount: number;
  token: CurrencyId;
}

function getInputShadow (error: boolean, focused: boolean): string {
  if (error) return '0 0 2px 2px var(--input-shadow-error)';

  if (focused) return '0 0 2px 2px var(--input-shadow)';

  return 'none';
}

export const BalanceInputRoot = styled.div<{
  error: boolean;
  focused: boolean;
}>`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 100px;
  align-items: stretch;
  padding: 0 8px;
  transition: all .2s cubic-bezier(0.0, 0, 0.2, 1);
  border-radius: 2px;
  border: ${({ error }): string => {
    if (error) return '1px solid var(--input-border-color-error)';

    return '1px solid var(--input-border-color)';
  }};

  box-shadow: ${({ error, focused }): string => getInputShadow(error, focused)};

  &:hover {
    box-shadow: ${({ error }): string => getInputShadow(error, true)};
  }
`;

export interface BalanceInputProps extends BareProps {
  disableZeroBalance?: boolean;
  selectableTokens?: CurrencyId[];
  enableTokenSelect?: boolean;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  disabled?: boolean;
  disableTokens?: CurrencyId[];
  onChange?: (value: Partial<BalanceInputValue>) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  value?: Partial<BalanceInputValue>;
  tokenPosition?: 'left' | 'right';
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
  disableZeroBalance = true,
  className,
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
  showToken = true,
  size = 'large',
  tokenPosition = 'right',
  value
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  const isLPToken = useMemo(() => value?.token?.isDexShare, [value]);
  const showMaxBtn = useMemo(() => !!onMax, [onMax]);

  const onTokenChange = useCallback((token: CurrencyId) => {
    if (!onChange) return;

    if (!value) return;

    onChange({ amount: value.amount || 0, token });
  }, [onChange, value]);

  const onValueChange = useCallback((amount: number) => {
    if (!onChange) return;

    if (!value) return;

    onChange({ amount, token: value.token });
  }, [onChange, value]);

  const renderToken = useCallback((): ReactNode => {
    if (!showToken) return null;

    return (
      <Condition
        condition={enableTokenSelect}
        match={(
          <TokenSelector
            checkBalance={disableZeroBalance}
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
            value={value?.token}
          />
        )}
        or={(
          <div className={clsx(classes.token, { [classes.showIcon]: showIcon })}>
            { showIcon ? <TokenImage currency={value?.token} /> : null }
            <InlineBlockBox margin={[0, 8]}>
              <TokenName currency={value?.token || ''} />
            </InlineBlockBox>
          </div>
        )}
      />
    );
  }, [value, disableTokens, enableTokenSelect, onTokenChange, selectableTokens, showIcon, showToken, tokenPosition, disableZeroBalance]);

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
      [classes.noToken]: !showToken,
      [classes.error]: !!error,
      [classes.focused]: focused,
      [classes.showMax]: showMaxBtn,
      [classes.showIcon]: showIcon,
      [classes.lpToken]: isLPToken
    }
  ), [className, size, disabled, showToken, error, focused, showMaxBtn, showIcon, isLPToken]);

  return (
    <BalanceInputRoot
      className={rootClasses}
      error={!!error}
      focused={focused}
    >
      <Condition condition={tokenPosition === 'left'}>
        {renderToken}
      </Condition>
      <NumberInput
        className={classes.input}
        disabled={disabled}
        max={max}
        min={min}
        onBlur={_onBlur}
        onChange={onValueChange}
        onFocus={_onFocus}
        placeholder={placeholder}
        value={value?.amount}
        {...numberInputProps}
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
    </BalanceInputRoot>
  );
};
