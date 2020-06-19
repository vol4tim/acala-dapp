import React, { FC } from 'react';

import { usePrice } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

import { FormatFixed18, FormatFixed18Props } from './format';

interface Props extends BareProps, FormatFixed18Props {
  currency: CurrencyLike;
}

/**
 * @name Price
 * @description show the `currency` price
 */
export const Price: FC<Props> = ({
  className,
  currency
}) => {
  const price = usePrice(currency);

  if (!price) {
    return null;
  }

  return (
    <FormatFixed18
      className={className}
      data={price}
      prefix='$'
    />
  );
};
