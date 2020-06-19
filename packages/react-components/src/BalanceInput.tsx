import React, { FC, memo, FocusEventHandler, useState, ReactNode, ChangeEventHandler, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { FormikErrors } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { useApi } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';

import { TokenName } from './Token';
import { TokenSelector } from './TokenSelector';
import { getCurrencyIdFromName } from './utils';
import classes from './BalanceInput.module.scss';
import { Button, Condition } from '@acala-dapp/ui-components';

type BalanceInputSize = 'large' | 'middle';

export interface BalanceInputProps extends BareProps {
  currencies?: (CurrencyId | string)[];
  enableTokenSelect?: boolean;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  disabled?: boolean;
  id?: string;
  name?: string;
  onChange?: any;
  onTokenChange?: (token: CurrencyId) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  token: CurrencyId | string;
  tokenPosition?: 'left' | 'right';
  value?: number;
  showMaxBtn?: boolean;
  showIcon?: boolean;
  size?: BalanceInputSize;
  onMax?: () => void;
  withHover?: boolean;
  withFocused?: boolean;
  withError?: boolean;
}

export const BalanceInput: FC<BalanceInputProps> = memo(({
  className,
  currencies,
  disabled = false,
  enableTokenSelect = false,
  error,
  id,
  name,
  onBlur,
  onChange,
  onFocus,
  onMax,
  onTokenChange,
  placeholder,
  showIcon = true,
  showMaxBtn = false,
  size = 'large',
  token,
  tokenPosition = 'right',
  value,
  withError = true,
  withFocused = true,
  withHover = true
}) => {
  const { api } = useApi();
  const [focused, setFocused] = useState<boolean>(false);

  const _token = useMemo(() => {
    if (typeof token === 'string') return getCurrencyIdFromName(api, token);

    return token;
  }, [api, token]);

  const renderToken = useCallback((): ReactNode => {
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
            currencies={currencies}
            onChange={onTokenChange}
            showIcon={showIcon}
            value={_token}
          />
        )}
        or={(
          <TokenName
            className={classes.token}
            currency={_token}
          />
        )}
      />
    );
  }, [enableTokenSelect, tokenPosition, currencies, onTokenChange, showIcon, _token]);

  const _onFocus: FocusEventHandler<HTMLInputElement> = useCallback((event) => {
    setFocused(true);
    onFocus && onFocus(event);
  }, [setFocused, onFocus]);

  const _onBlur: FocusEventHandler<HTMLInputElement> = useCallback((event) => {
    setFocused(false);
    onBlur && onBlur(event);
  }, [setFocused, onBlur]);

  const _onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    if (onChange) onChange(e);
  }, [onChange]);

  const rootClasses = useMemo<string>((): string => clsx(
    className,
    classes.root,
    classes[size],
    {
      [classes.hover]: withHover,
      [classes.error]: withError && !!error,
      [classes.focused]: withFocused && focused
    }
  ), [className, error, focused, size, withError, withHover, withFocused]);

  return (
    <div className={rootClasses}>
      <Condition condition={tokenPosition === 'left'}>
        {renderToken}
      </Condition>
      <input
        className={classes.input}
        disabled={disabled}
        id={id}
        name={name}
        onBlur={_onBlur}
        onChange={_onChange}
        onFocus={_onFocus}
        placeholder={placeholder}
        type='number'
        value={value}
      />
      <Condition condition={showMaxBtn}>
        <Button
          className={classes.maxBtn}
          color='primary'
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
});

BalanceInput.displayName = 'BalanceInput';
