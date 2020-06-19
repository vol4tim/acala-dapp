import React, { FC, memo, useEffect, useState, ReactNode } from 'react';
import clsx from 'clsx';
import { noop } from 'lodash';

import { CurrencyId } from '@acala-network/types/interfaces';

import { BareProps } from '@acala-dapp/ui-components/types';
import { useApi, useConstants } from '@acala-dapp/react-hooks';
import { Dropdown, DropdownConfig } from '@acala-dapp/ui-components';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

import { Token } from './Token';
import { getCurrencyIdFromName, tokenEq } from './utils';

interface Props extends BareProps {
  currencies?: CurrencyLike[];
  onChange?: (token: CurrencyId) => void;
  value?: CurrencyLike;
  showIcon?: boolean;
}

export const TokenSelector: FC<Props> = memo(({
  className,
  currencies,
  onChange = noop,
  value,
  showIcon
}) => {
  const { api } = useApi();
  const [_currencies, setCurrencies] = useState<(CurrencyId)[]>([]);
  const { allCurrencies } = useConstants();

  // format currencies and set default vlaue if need
  useEffect(() => {
    // set default currencies
    if (!currencies) {
      setCurrencies(allCurrencies);
    } else {
      // convert string to CurrencyId
      const result = currencies.map((item: CurrencyLike): CurrencyId => {
        if (typeof item === 'string') {
          return getCurrencyIdFromName(api, item);
        }

        return item;
      });

      setCurrencies(result);
    }
  }, [allCurrencies, api, currencies]);

  if (!_currencies.length) {
    return null;
  }

  const config: DropdownConfig[] = _currencies.map((currency: CurrencyId) => ({
    /* eslint-disable-next-line react/display-name */
    render: (): ReactNode => {
      return (
        <Token
          currency={currency}
          icon={showIcon}
        />
      );
    },
    value: currency
  }));

  return (
    <Dropdown
      className={
        clsx(
          className
        )
      }
      compareFN={tokenEq}
      config={config}
      onChange={onChange}
      value={value}
    />
  );
});

TokenSelector.displayName = 'TokenSelector';
