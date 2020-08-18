import React, { memo, FC } from 'react';
import { BareProps } from './types';
import classes from './Tag.module.scss';
import clsx from 'clsx';

type ColorType = 'normal' | 'white' | 'primary';

interface Props extends BareProps {
  color?: ColorType;
  onClick?: () => void;
}

export const Tag: FC<Props> = memo(({
  children,
  className,
  color = 'normal',
  onClick
}) => {
  return (
    <span
      className={
        clsx(
          classes.root,
          classes[color],
          className,
          {
            [classes.clickable]: onClick
          }
        )
      }
      onClick={onClick}
    >
      {children}
    </span>
  );
});

Tag.displayName = 'Tag';

export const TagGroup: FC<BareProps> = memo(({
  children,
  className
}) => {
  return (
    <div className={clsx(classes.tagGroup, className)}>
      {children}
    </div>
  );
});

TagGroup.displayName = 'TagGroup';
