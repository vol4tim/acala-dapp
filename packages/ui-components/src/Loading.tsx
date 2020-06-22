import React, { FC, Suspense, ReactNode, useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Loading.module.scss';
import { setInterval } from 'timers';

interface Props extends BareProps {
  size?: 'normal' | 'small';
}

export const Loading: FC<Props> = ({
  className,
  size = 'normal'
}) => {
  return (
    <div
      className={
        clsx(
          classes.root,
          className,
          classes[size]
        )
      }
    >
      <div className={classes.loader} />
    </div>
  );
};

export const FullLoading: FC = () => {
  return (
    <div className={classes.fullscreen}>
      <Loading/>
    </div>
  );
};

export const PageLoading: FC = () => {
  return (
    <div className={classes.page}>
      <Loading/>
    </div>
  );
};

export const CardLoading: FC = () => {
  return (
    <div className={classes.card}>
      <Loading/>
    </div>
  );
};

export interface ComponentLoadingProps extends BareProps{
  minDurationTime: number;
}

export const ComponentLoading: FC<ComponentLoadingProps> = ({
  children,
  minDurationTime = 300
}) => {
  const [largerThanMinDurationFlag, setLargerThanMinDurationFlag] = useState<boolean>(false);

  useEffect(() => {
    if (largerThanMinDurationFlag) return;

    const interval = setInterval(() => {
      setLargerThanMinDurationFlag(true);
      clearInterval(interval);
    }, minDurationTime);
  });

  const checkIfShowLoading = useMemo(() => {
    // when children is ready but duration is smaller than largerThanMinDuration
    if (!children && largerThanMinDurationFlag === false) {
      return true;
    }

    return false;
  }, [children, largerThanMinDurationFlag]);

  return (
    <Suspense fallback={<CardLoading />}>
      {checkIfShowLoading ? null : children}
    </Suspense>
  );
};
