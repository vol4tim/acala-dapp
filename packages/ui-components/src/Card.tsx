import React, { ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Card.module.scss';

export interface CardProps extends BareProps {
  headerClassName?: string;
  contentClassName?: string;
  header?: ReactNode;
  extra?: ReactNode;
  divider?: boolean;
  padding?: boolean;
  overflowHidden?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  contentClassName,
  divider = true,
  extra,
  header,
  headerClassName,
  overflowHidden = false,
  padding = true
}, ref) => {
  const rootClassName = clsx(
    classes.root,
    className,
    {
      [classes.overflowHidden]: overflowHidden
    }
  );

  const _contentClassName = clsx(
    contentClassName,
    classes.content,
    {
      [classes.padding]: padding,
      [classes.noTitleContent]: !header && padding
    }
  );

  return (
    <section
      className={rootClassName}
      ref={ref}
    >
      { header ? <div className={clsx(headerClassName, classes.title, { [classes.divider]: divider })}>
        {header}
        {extra ? <div className={classes.extra}>{extra}</div> : null}
      </div> : null }
      <div className={_contentClassName}>
        {children}
      </div>
    </section>
  );
});

Card.displayName = 'Card';
