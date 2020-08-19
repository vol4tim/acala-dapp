import React, { FC, FocusEventHandler, useState, ReactNode, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { FormikErrors } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { useApi } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { Button, Condition, NumberInput, NumberInputProps } from '@acala-dapp/ui-components';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

import { TokenName, TokenImage } from './Token';
import { TokenSelector } from './TokenSelector';
import { getCurrencyIdFromName } from './utils';
import classes from './BalanceInput.module.scss';
import { CurrencyChangeFN } from './types';

type BalanceInputSize = 'large' | 'middle' | 'small' | 'mini';

export interface BalanceInputProps extends BareProps {
  currencies?: (CurrencyId | string)[];
  enableTokenSelect?: boolean;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  disabled?: boolean;
  disabledCurrencies?: CurrencyLike[];
  onChange?: (value: number) => void;
  onTokenChange?: CurrencyChangeFN;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  token: CurrencyLike | string;
  tokenPosition?: 'left' | 'right';
  value?: number;
  showMaxBtn?: boolean;
  showIcon?: boolean;
  showToken?: boolean;
  size?: BalanceInputSize;
  onMax?: () => void;
  border?: boolean;
  id?: string;
  name?: string;
  numberInputProps?: Partial<NumberInputProps>;
}

export const BalanceInput: FC<BalanceInputProps> = ({
  border = true,
  className,
  currencies,
  disabled = false,
  disabledCurrencies,
  enableTokenSelect = false,
  error,
  id,
  name,
  numberInputProps,
  onBlur,
  onChange,
  onFocus,
  onMax,
  onTokenChange,
  placeholder,
  showIcon = true,
  showMaxBtn = false,
  showToken = true,
  size = 'large',
  token,
  tokenPosition = 'right',
  value
}) => {
  const { api } = useApi();
  const [focused, setFocused] = useState<boolean>(false);

  const _token = useMemo(() => {
    if (typeof token === 'string') return getCurrencyIdFromName(api, token);

    return token;
  }, [api, token]);

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
            currencies={currencies}
            disabledCurrencies={disabledCurrencies}
            onChange={onTokenChange}
            showIcon={showIcon}
            value={_token}
          />
        )}
        or={(
          <div className={clsx(classes.token, { [classes.showIcon]: showIcon })}>
            { showIcon ? <TokenImage currency={_token} /> : null }
            <TokenName currency={_token} />
          </div>
        )}
      />
    );
  }, [showToken, enableTokenSelect, tokenPosition, showIcon, currencies, onTokenChange, _token, disabledCurrencies]);

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
      [classes.showIcon]: showIcon
    }
  ), [className, size, disabled, border, showToken, error, focused, showMaxBtn, showIcon]);

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
        id={id}
        name={name}
        onBlur={_onBlur}
        onChange={onChange}
        onFocus={_onFocus}
        placeholder={placeholder}
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
};
