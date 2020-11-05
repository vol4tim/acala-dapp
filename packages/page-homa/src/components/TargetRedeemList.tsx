import React, { FC } from 'react';

import { formatDuration, getTokenName } from '@acala-dapp/react-components';
import { Dropdown, DropdownConfig } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';

import classes from './TargetRedeemList.module.scss';
import { useStakingPool, useStakingPoolFreeList, useApi, useConstants } from '@acala-dapp/react-hooks';

interface Props extends BareProps {
  value: number;
  onChange: (value: number) => void;
}

export const TargetRedeemList: FC<Props> = ({
  className,
  onChange,
  value
}) => {
  const { api } = useApi();
  const { liquidCurrency } = useConstants();
  const stakingPool = useStakingPool();
  const freeList = useStakingPoolFreeList();

  const config: DropdownConfig[] = freeList.map(({ amount, era }): DropdownConfig => {
    if (!stakingPool) return { render: (): null => null, value: '' };

    const duration = formatDuration(
      (era - stakingPool.derive.currentEra.toNumber()) *
        (api.consts.polkadotBridge.eraLength as any).toNumber() *
        4 * 1000
    );

    return {
      /* eslint-disable-next-line react/display-name */
      render: (): JSX.Element => {
        return (
          <div className={classes.item}>
            <span>
              {`at era ${era}(≈ ${duration} days later) has ${
                amount.div(stakingPool.stakingPool.liquidExchangeRate()).toNumber()
              } ${getTokenName(liquidCurrency.asToken.toString())} to redeem`}</span>
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
