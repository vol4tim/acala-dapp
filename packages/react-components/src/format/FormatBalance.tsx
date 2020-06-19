import React, { FC, useRef, ReactElement } from 'react';
import { compose, curry, placeholder } from 'lodash/fp';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

import { Balance as BalanceType } from '@polkadot/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@acala-dapp/ui-components/types';
import { randomID, Condition } from '@acala-dapp/ui-components';

import { formatBalance, getTokenName, thousand, effectiveDecimal } from '../utils';
import classes from './format.module.scss';

export interface BalancePair {
  balance?: BalanceType | Fixed18 | number;
  currency?: CurrencyId | string;
}

export interface FormatBalanceProps extends BareProps {
  balance?: BalanceType | Fixed18 | number;
  currency?: CurrencyId | string;
  decimalLength?: number;
  pair?: BalancePair[];
  pairSymbol?: string;
  primary?: boolean;
  withTooltip?: boolean;
}

export const FormatBalance: FC<FormatBalanceProps> = ({
  balance,
  className,
  currency,
  decimalLength = 2,
  pair,
  pairSymbol,
  primary = false,
  withTooltip = true
}) => {
  const pairLength = pair ? pair.length : 0;
  const _id = useRef(randomID());

  const renderBalance = (data: BalancePair, index: number, usethousand: boolean): ReactElement => {
    const _noop = (i: any): any => i;

    const _transform = compose(
      curry(effectiveDecimal)(placeholder, decimalLength),
      usethousand ? thousand : _noop
    );

    const _balance = formatBalance(data?.balance);
    const balance = _balance.isNaN() ? _balance.toString() : _transform(_balance.toNumber(18, 3));

    return (
      <span key={`${_id}-${index}`}>
        {balance}
        {data.currency ? <span>{' '}{getTokenName(data.currency)}</span> : null}
        {(pairSymbol && index !== pairLength - 1) ? <span>{' '}{pairSymbol}{' '}</span> : null}
      </span>
    );
  };

  const renderInner = (): JSX.Element => {
    return (
      <span
        className={
          clsx(
            className,
            {
              [classes.primary]: primary
            }
          )
        }
      >
        {pair ? pair.map((data, index) => renderBalance(data, index, true)) : renderBalance({ balance, currency }, -1, true)}
      </span>
    );
  };

  return (
    <Condition condition={withTooltip}
      or={renderInner}
    >
      <Tooltip
        placement='left'
        title={pair ? pair.map((data, index) => renderBalance(data, index, true)) : renderBalance({ balance, currency }, -1, true)}
      >
        {renderInner()}
      </Tooltip>
    </Condition>
  );
};
