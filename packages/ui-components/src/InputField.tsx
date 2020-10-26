import React, { FC, ReactNode, useMemo } from 'react';

import { ReactComponent as RightArrowIcon } from './assets/right-arrow.svg';
import { ReactComponent as AddIcon } from './assets/add.svg';
import classes from './InputField.module.scss';
import clsx from 'clsx';
import { Condition } from './Condition';

export interface InputFieldProps {
  leftAddition?: () => ReactNode;
  leftTitle: () => ReactNode;
  leftRender: () => ReactNode;
  rightAddition?: () => ReactNode;
  rightTitle: () => ReactNode;
  rightRender: () => ReactNode;
  actionRender: () => ReactNode;
  separation: 'right-arrow' | 'plus' | (() => ReactNode);
}

export const InputField: FC<InputFieldProps> = ({
  actionRender,
  leftAddition,
  leftRender,
  leftTitle,
  rightAddition,
  rightRender,
  rightTitle,
  separation
}) => {
  const _separation = useMemo(() => {
    if (separation === 'right-arrow') {
      return (
        <div className={classes.rightArrow}>
          <RightArrowIcon />
        </div>
      );
    }

    if (separation === 'plus') {
      return (
        <div className={classes.rightArrow}>
          <AddIcon />
        </div>
      );
    }

    return separation();
  }, [separation]);

  return (
    <div className={classes.root}>
      <div className={clsx(classes.leftTitle, classes.title)}>
        {leftTitle()}
      </div>
      <div className={clsx(classes.leftContent)}>
        {leftRender()}
      </div>
      <div className={clsx(classes.separation)}>
        {_separation}
      </div>
      <div className={clsx(classes.rightTitle, classes.title)}>
        {rightTitle()}
      </div>
      <div className={clsx(classes.rightContent)}>
        {rightRender()}
      </div>
      <div className={clsx(classes.actionBtn)}>
        {actionRender()}
      </div>
      {
        leftAddition ? (
          <div className={clsx(classes.leftAddition)}>
            {leftAddition()}
          </div>
        ) : null
      }
      {
        rightAddition ? (
          <div className={clsx(classes.rightAddition)}>
            {rightAddition()}
          </div>
        ) : null
      }
    </div>
  );
};
