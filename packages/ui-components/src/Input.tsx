import React, { InputHTMLAttributes, FC, ReactNode, useState, FocusEventHandler, useCallback } from 'react';
import clsx from 'clsx';

import classes from './Input.module.scss';
import { Condition } from './Condition';
import { Button } from './Button';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  inputClassName?: string;
  error?: string | string[] | any;
  size?: 'small' | 'large' | 'normal';
  suffix?: ReactNode;
  prefix?: ReactNode;
  showMaxBtn?: boolean;
  onMax?: () => void;
  withHover?: boolean;
  withError?: boolean;
  withFocuse?: boolean;
}

export const Input: FC<InputProps> = ({
  className,
  error,
  inputClassName,
  onMax,
  prefix,
  showMaxBtn = false,
  size = 'normal',
  suffix,
  withError = true,
  withFocuse = true,
  withHover = true,
  ...other
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  const onFocus: FocusEventHandler<HTMLInputElement> = useCallback((event) => {
    setFocused(true);

    if (other.onFocus) other.onFocus(event);
  }, [setFocused, other]);

  const onBlur: FocusEventHandler<HTMLInputElement> = useCallback((event) => {
    setFocused(false);

    if (other.onBlur) other.onBlur(event);
  }, [setFocused, other]);

  return (
    <div
      className={
        clsx(
          classes.root,
          className,
          classes[size],
          {
            [classes.hover]: withHover,
            [classes.focused]: withFocuse && focused,
            [classes.error]: withError && error
          }
        )
      }
      onBlur={onBlur}
      onFocus={onFocus}
    >
      <Condition condition={!!prefix}>
        <span className={classes.prefix}>{prefix}</span>
      </Condition>
      <input
        className={clsx(classes.input, inputClassName)}
        {...other}
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
      <Condition condition={!!suffix}>
        <span className={classes.suffix}>{suffix}</span>
      </Condition>
      <p className={clsx(classes.error, { [classes.show]: !!error })}>{error ? error.toString() : ''}</p>
    </div>
  );
};
