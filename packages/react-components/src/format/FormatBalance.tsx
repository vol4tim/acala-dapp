import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import clsx from 'clsx';

import { Balance as BalanceType } from '@polkadot/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';
import { FixedPointNumber } from '@acala-network/sdk-core';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@acala-dapp/ui-components/types';

import { formatBalance, sortCurrency } from '../utils';
import { FormatNumber, FormatNumberProps, FormatterColor } from './FormatNumber';
import classes from './format.module.scss';
import { TokenName } from '../Token';

export interface BalancePair {
  balance?: BalanceType | Fixed18 | FixedPointNumber | number;
  currency?: CurrencyId;
}

export interface FormatBalanceProps extends BareProps {
  balance?: BalanceType | Fixed18 | FixedPointNumber | number;
  currency?: CurrencyId;
  pair?: BalancePair[];
  pairSymbol?: string;
  decimalLength?: number;
  color?: FormatterColor;
  isSort?: boolean;
}

const formatBalanceConfig: FormatNumberProps['formatNumberConfig'] = {
  decimalLength: 6,
  removeEmptyDecimalParts: true,
  removeTailZero: true
};

export const FormatBalance: FC<FormatBalanceProps> = ({
  balance,
  className,
  color,
  currency,
  decimalLength = 6,
  isSort = true,
  pair,
  pairSymbol
}) => {
  const pairLength = useMemo(() => pair ? pair.length : 0, [pair]);

  const renderBalance = useCallback((data: BalancePair, index: number): ReactNode => {
    const _balance = formatBalance(data?.balance);

    return [
      <span key={'format-balance-' + index}>
        <FormatNumber
          data={isFinite(_balance) ? _balance : 0}
          formatNumberConfig={{ ...formatBalanceConfig, decimalLength }}
        />
        {data.currency ? <span>{' '}</span> : null}
        {data.currency ? <TokenName currency={data.currency} /> : null}
      </span>,
      (pairSymbol && index !== pairLength - 1) ? <span key={'format-balance-symbol-' + index}>{' '}{pairSymbol}{' '}</span> : null
    ];
  }, [decimalLength, pairSymbol, pairLength]);

  return (
    <span className={clsx(classes.balance, className, color)}>
      {
        pair
          ? (isSort ? pair.sort((p1, p2) => sortCurrency(p1.currency, p2.currency)) : pair).map((data, index) => renderBalance(data, index))
          : renderBalance({ balance, currency }, -1)
      }
    </span>
  );
};
