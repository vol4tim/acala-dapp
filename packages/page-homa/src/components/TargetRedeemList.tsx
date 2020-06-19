import React, { FC, useContext } from 'react';

import { formatDuration, getTokenName } from '@acala-dapp/react-components';
import { Dropdown, DropdownConfig } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';

import classes from './TargetRedeemList.module.scss';
import { StakingPoolContext } from './StakingPoolProvider';

interface Props extends BareProps {
  value: number;
  onChange: (value: number) => void;
}

export const TargetRedeemList: FC<Props> = ({
  className,
  onChange,
  value
}) => {
  const { eraDuration, freeList, stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);

  const config: DropdownConfig[] = freeList.map(({ era, free }): DropdownConfig => {
    if (!stakingPoolHelper || !stakingPool) return { render: (): null => null, value: '' };

    const duration = formatDuration((era - stakingPoolHelper.currentEra) * eraDuration);

    return {
      /* eslint-disable-next-line react/display-name */
      render: (): JSX.Element => {
        return (
          <div className={classes.item}>
            <span>
              {`at era ${era}(≈ ${duration} days later) has ${free.div(stakingPoolHelper.liquidExchangeRate)} ${getTokenName(stakingPool.liquidCurrency)} to redeem`}</span>
          </div>
        );
      },
      value: era
    };
  });

  return (
    <Dropdown
      className={className}
      config={config}
      menuClassName={classes.menu}
      onChange={onChange}
      selectedRender={(era): string => era}
      size='small'
      value={value}
    />
  );
};
