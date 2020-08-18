import React, { FC, useMemo } from 'react';
import { FormatNumber, FormatNumberProps } from './FormatNumber';
import { Fixed18 } from '@acala-network/app-util';

const FormatRatioConfig: FormatNumberProps['formatNumberConfig'] = {
  decimalLength: 2,
  removeEmptyDecimalParts: true,
  removeTailZero: true
};

export const FormatRatio: FC<FormatNumberProps> = ({ data, ...props }) => {
  const _data = useMemo(() => {
    return (data instanceof Fixed18 ? data : Fixed18.fromNatural(data || 0)).mul(Fixed18.fromNatural(100));
  }, [data]);

  return (
    <FormatNumber
      data={_data}
      formatNumberConfig={FormatRatioConfig}
      suffix={_data.isFinity() ? '%' : ''}
      {...props}
    />
  );
};
