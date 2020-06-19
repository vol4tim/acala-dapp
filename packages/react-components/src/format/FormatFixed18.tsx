import React, { FC, ReactElement } from 'react';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

import { Fixed18 } from '@acala-network/app-util';
import { BareProps } from '@acala-dapp/ui-components/types';

import { thousand, effectiveDecimal } from '../utils';
import classes from './format.module.scss';

export interface FormatFixed18Props extends BareProps {
  data?: Fixed18;
  format?: 'percentage' | 'number' | 'thousand';
  prefix?: string;
  primary?: boolean;
  withTooltip?: boolean;
  effectiveDecimalLength?: number;
}

export const FormatFixed18: FC<FormatFixed18Props> = ({
  className,
  data,
  effectiveDecimalLength = 2,
  format = 'thousand',
  prefix,
  primary = false,
  withTooltip = true
}) => {
  if (!data) {
    return null;
  }

  const getRenderText = (): string => {
    let _text = '';

    if (!data.isFinity()) {
      return 'NaN';
    }

    if (format === 'number') {
      _text = effectiveDecimal(data.toString(18, 3), effectiveDecimalLength);
    }

    if (format === 'thousand') {
      _text = effectiveDecimal(thousand(data.toNumber(18, 3)), effectiveDecimalLength);
    }

    if (format === 'percentage') {
      _text = data.mul(Fixed18.fromNatural(100)).toString(2, 3) + '%';
    }

    return `${prefix || ''}${_text}`;
  };

  const inner = (): ReactElement => (
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
      {getRenderText()}
    </span>
  );

  if (withTooltip) {
    return (
      <Tooltip
        arrow
        placement='left'
        title={data.toString(18, 3)}
      >
        {inner()}
      </Tooltip>
    );
  }

  return inner();
};
