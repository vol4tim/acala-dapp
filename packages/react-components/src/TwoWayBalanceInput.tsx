import React, { FC, useState, useCallback, useMemo, useEffect } from 'react';
import { noop } from 'lodash';
import clsx from 'clsx';
import { useFormik } from 'formik';

import classes from './TwoWayBalanceInput.module.scss';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';

import { FormatFixed18 } from './format';
import { TokenImage, TokenName } from './Token';
import { BalanceInput } from './BalanceInput';
import { Condition, SwitchIcon } from '@acala-dapp/ui-components';
import { useFormValidator, useBalance } from '@acala-dapp/react-hooks';

interface TwoWayBalanceInputProps {
  className?: string;
  initCurrencies: [CurrencyLike, CurrencyLike];
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
  const [primaryCurrency] = useState<CurrencyLike>(initCurrencies[0]);
  const [referenceCurrency] = useState<CurrencyLike>(initCurrencies[1]);
  const primaryCurrencyBalance = useBalance(primaryCurrency);

  const primaryMax = useMemo<Fixed18>((): Fixed18 => {
    const _primaryCurrencyBalance = convertToFixed18(primaryCurrencyBalance || Fixed18.ZERO);

    if (max === undefined) return _primaryCurrencyBalance;

    const _max = Fixed18.fromNatural(max);

    return _max.min(_primaryCurrencyBalance);
  }, [max, primaryCurrencyBalance]);

  const referenceMax = useMemo<Fixed18>((): Fixed18 => {
    if (!primaryMax) return Fixed18.ZERO;

    return primaryMax.mul(exchangeRate);
  }, [primaryMax, exchangeRate]);

  const validator = useFormValidator({
    primary: {
      max: primaryMax.toNumber(6, 3),
      type: 'number'
    },
    reference: {
      max: referenceMax.toNumber(6, 3),
      type: 'number'
    }
  });

  const form = useFormik({
    initialValues: {
      primary: '' as any as number,
      reference: '' as any as number
    },
    onSubmit: noop,
    validate: validator
  });

  const showError = useMemo(() => {
    return direction === 'forward' ? form.errors.primary : form.errors.reference;
  }, [form, direction]);

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
    form.resetForm();
    setDirection(direction === 'forward' ? 'reverse' : 'forward');
  }, [setDirection, direction, form]);

  const handlePrimaryMax = useCallback(() => {
    if (!primaryMax) return;

    form.setValues({
      primary: primaryMax.toNumber(6, 3),
      reference: primaryMax.mul(exchangeRate).toNumber(6, 3)
    });
  }, [primaryMax, form, exchangeRate]);

  const handleReferenceMax = useCallback(() => {
    if (!referenceMax) return;

    form.setValues({
      primary: primaryMax.toNumber(6, 3),
      reference: referenceMax.toNumber(6, 3)
    });
  }, [referenceMax, form, primaryMax]);

  const handlePrimaryChange = useCallback((value: number) => {
    form.setValues({
      primary: value,
      reference: Fixed18.fromNatural(value).mul(exchangeRate).toNumber(6, 3)
    });
  }, [form, exchangeRate]);

  const handleReferenceChange = useCallback((value: number) => {
    form.setValues({
      primary: Fixed18.fromNatural(value).div(exchangeRate).toNumber(6, 3),
      reference: value
    });
  }, [form, exchangeRate]);

  // expose reset action to father component
  useEffect(() => {
    if (exposeReset) {
      exposeReset(form.resetForm);
    }
  }, [form, exposeReset]);

  // notify father compoent the primary value
  useEffect(() => {
    onChange(form.values.primary);
  }, [form.values.primary, onChange]);

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
            error={direction === 'forward' ? form.errors.primary : form.errors.reference}
            id={ direction === 'forward' ? 'primary' : 'reference'}
            name={ direction === 'forward' ? 'primary' : 'reference'}
            onBlur={handleBlur}
            onChange={direction === 'forward' ? handlePrimaryChange : handleReferenceChange}
            onFocus={handleFocus}
            onMax={direction === 'forward' ? handlePrimaryMax : handleReferenceMax}
            showMaxBtn
            token={direction === 'forward' ? primaryCurrency : referenceCurrency}
            value={direction === 'forward' ? form.values.primary : form.values.reference}
          />
        </div>
        <div className={classes.displayArea}>
          <FormatFixed18
            className={classes.amount}
            data={Fixed18.fromNatural((direction === 'forward' ? form.values.reference : form.values.primary) || 0)}
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
