import React, { FC, useMemo } from 'react';

import { usePrice } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

import { FormatPrice } from './format';
import { Fixed18 } from '@acala-network/app-util';

interface Props extends BareProps {
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

  const _price = useMemo(() => {
    return price || Fixed18.ZERO;
  }, [price]);

  return (
    <FormatPrice
      className={className}
      data={_price}
    />
  );
};
