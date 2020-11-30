import React, { FC } from 'react';
import clsx from 'clsx';

import { useApi, useModal } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { Skeleton } from '@acala-dapp/ui-components';

import { ReactComponent as NetworkIcon } from './assets/network.svg';
import { ReactComponent as AcalaIcon } from './assets/aca-network.svg';
import classes from './ChainName.module.scss';
import { SelectNetwork } from './SelectNetwork';

interface ChainNameProps extends BareProps {
  collapse: boolean;
}

export const ChainName: FC<ChainNameProps> = ({ className, collapse }) => {
  const { chainInfo, loading } = useApi();
  const { close, open: openChainSelector, status } = useModal();

  return (
    <>
      <div
        className={
          clsx(
            className,
            classes.root
          )
        }
        onClick={openChainSelector}
      >
        {
          loading || !chainInfo?.chainName ? (
            <Skeleton.Button
              active
              className={classes.skeleton}
              size='small'
            />
          ) : (
            <>
              <NetworkIcon className={classes.networkIcon} />
              {
                collapse ? null : (
                  <div className={classes.chainName}>
                    <AcalaIcon className={classes.chainIcon} />
                    {chainInfo.chainName}
                  </div>
                )
              }
            </>
          )
        }
      </div>
      <SelectNetwork
        onClose={close}
        visiable={status}
      />
    </>
  );
};
