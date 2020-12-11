import React, { ReactNode, FC } from 'react';

import { Token } from '@acala-network/sdk-core';
import { BalanceInput, getCurrencyIdFromToken, BalanceInputValue } from '@acala-dapp/react-components';
import { useApi } from '@acala-dapp/react-hooks';
import { Condition } from '@acala-dapp/ui-components';

import classes from './SwapInput.module.scss';

export interface SwapInputProps {
  addon?: ReactNode;
  error: any;
  title: string;
  selectableTokens: Token[]; // selectable token list
  disableTokens: Token[]; // disable token list

  value: BalanceInputValue;
  onChange: (value: BalanceInputValue) => void;

  showMax?: boolean;
  onMax?: () => void;

  onFocus?: () => void;
  onBlur?: () => void;

  renderExtra?: () => ReactNode;
}

export const SwapInput: FC<SwapInputProps> = ({
  addon,
  disableTokens,
  error,
  onChange,
  onFocus,
  onMax,
  renderExtra,
  selectableTokens,
  showMax,
  title,
  value
}) => {
  const { api } = useApi();

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        {title}
        <Condition condition={!!renderExtra}>
          {renderExtra ? renderExtra() : null}
        </Condition>
      </div>
      <BalanceInput
        className={classes.input}
        disableTokens={disableTokens.map((item) => getCurrencyIdFromToken(api, item))}
        enableTokenSelect={true}
        error={error}
        onChange={onChange}
        onFocus={onFocus}
        onMax={onMax}
        selectableTokens={selectableTokens.map((item) => getCurrencyIdFromToken(api, item))}
        showMaxBtn={showMax}
        value={value}
      />
      {addon}
    </div>
  );
};
