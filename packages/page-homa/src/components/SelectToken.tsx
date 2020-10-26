import React, { FC, memo, useContext } from 'react';
import { noop } from 'lodash';

import { Dropdown } from '@acala-dapp/ui-components';
import { getTokenName } from '@acala-dapp/react-components';

import classes from './SelectToken.module.scss';
import { StakingPoolContext } from './StakingPoolProvider';

export const SelectToken: FC = memo(() => {
  const { stakingPool } = useContext(StakingPoolContext);
  const DEFAULT_VALUE = 'default';
  const config = [
    {
      render: (): string => {
        if (!stakingPool) {
          return '';
        }

        return `${getTokenName(stakingPool.stakingCurrency.asToken.toString())}/${getTokenName(stakingPool.liquidCurrency.asToken.toString())}`;
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
