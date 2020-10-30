import React, { FC, memo } from 'react';
import { noop } from 'lodash';

import { Dropdown } from '@acala-dapp/ui-components';
import { getTokenName } from '@acala-dapp/react-components';

import classes from './SelectToken.module.scss';
import { useConstants } from '@acala-dapp/react-hooks';

export const SelectToken: FC = memo(() => {
  const { liquidCurrency, stakingCurrency } = useConstants();
  const DEFAULT_VALUE = 'default';
  const config = [
    {
      render: (): string => {
        return `${getTokenName(stakingCurrency.asToken.toString())}/${getTokenName(liquidCurrency.asToken.toString())}`;
      },
      value: DEFAULT_VALUE
    }
  ];

  return (
    <Dropdown
      activeContentClassName={classes.activeContent}
      className={classes.root}
      config={config}
      onChange={noop}
      placeholder={''}
      value={DEFAULT_VALUE}
    />
  );
});

SelectToken.displayName = 'SelectToken';
