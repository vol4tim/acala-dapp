import React, { FC, memo, ReactElement } from 'react';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

import { Fixed18 } from '@acala-network/app-util';
import { BareProps } from '@honzon-platform/ui-components/types';
import { thousandth, padEndDecimal } from '../utils';

import classes from './format.module.scss';

interface Props extends BareProps {
  data: Fixed18;
  format?: 'percentage' | 'number' | 'thousandth';
  prefix?: string;
  primary?: boolean;
  withTooltip?: boolean;
  withPadEndDecimal?: boolean;
}

export const FormatFixed18: FC<Props> = memo(({
  className,
  data,
  format = 'thousandth',
  prefix,
  primary = false,
  withTooltip = true,
  withPadEndDecimal = false
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
      _text = withPadEndDecimal ? padEndDecimal(data.toString(6, 3), 6) : data.toString();
    }

    if (format === 'thousandth') {
      _text = withPadEndDecimal ? padEndDecimal(thousandth(data.toNumber(6, 3)), 6) : thousandth(data.toNumber(6, 3));
    }

    if (format === 'percentage') {
      _text = data.mul(Fixed18.fromNatural(100)).toString(2, 3) + '%';
    }

    return `${prefix ? prefix : ''}${_text}`;
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
        title={data.toString(18, 3)}
        placement='left'
      >
        {
          inner()
        }
      </Tooltip>
    );
  }

  return inner();

});

FormatFixed18.displayName = 'FormatFixed18';
