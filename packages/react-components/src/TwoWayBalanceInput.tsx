import React, { FC, useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { noop } from 'lodash';

import classes from './TwoWayBalanceInput.module.scss';

import { FormatNumber } from './format';
import { TokenImage, TokenName } from './Token';
import { BalanceInput, BalanceInputValue } from './BalanceInput';
import { Condition, SwitchIcon } from '@acala-dapp/ui-components';

interface TwoWayBalanceInputProps {
  className?: string;
  value: [BalanceInputValue, BalanceInputValue];
  onChange: (value: BalanceInputValue) => void;
  onSwap?: () => void;
  onMax?: () => void;
  showSwap?: boolean;
}

type Direction = 'forward' | 'reverse';

export const TwoWayBalanceInput: FC<TwoWayBalanceInputProps> = ({
  className,
  value,
  onChange,
  onMax = noop,
  onSwap = noop,
  showSwap = false
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  const rootClassName = useMemo(() => {
    return clsx(classes.root, className, {
      [classes.focused]: focused
    });
  }, [focused, className]);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, [setFocused]);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, [setFocused]);

  return (
    <div className={rootClassName}>
      <Condition condition={showSwap}>
        <div
          className={classes.switchArea}
          onClick={onSwap}
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
            onChange={onChange}
            onFocus={handleFocus}
            onMax={onMax}
            showMaxBtn
            value={value[0]}
          />
        </div>
        <div className={classes.displayArea}>
          <FormatNumber
            className={classes.amount}
            data={value[1].amount}
            prefix='≈'
          />
          <div className={classes.token}>
            <TokenImage
              className={classes.tokenImage}
              currency={value[1].token}
            />
            <TokenName
              className={classes.tokenName}
              currency={value[1].token}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
