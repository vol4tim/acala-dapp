import React, { FC, useCallback, useEffect } from 'react';
import clsx from 'clsx';

import { useApi, useModal } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { Skeleton } from '@acala-dapp/ui-components';

import { ReactComponent as NetworkIcon } from './assets/network.svg';
import { ReactComponent as AcalaIcon } from './assets/aca-network.svg';
import classes from './ChainName.module.scss';
import { SelectChain } from './SelectChain';

export const ChainName: FC<BareProps> = ({ className }) => {
  const { chain, error, loading } = useApi();
  const { close, open, status } = useModal();

  const openChainSelect = useCallback(() => {
    open();
  }, [open]);

  useEffect(() => {
    if (error) {
      open();
    }
  }, [error, open]);

  return (
    <div
      className={
        clsx(
          className,
          classes.root
        )
      }
      onClick={openChainSelect}
    >
      {
        loading || !chain ? (
          <Skeleton.Button
            active
            className={classes.skeleton}
            size='small'
          />
        ) : (
          <>
            <NetworkIcon className={classes.networkIcon} />
            <div
              className={classes.chainName}
            >
              <AcalaIcon className={classes.chainIcon} />
              {chain}
            </div>
          </>
        )
      }
      <SelectChain
        onClose={close}
        onConfirm={close}
        visiable={status}
      />
    </div>
  );
};
