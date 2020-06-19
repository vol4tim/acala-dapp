import React, { ReactNode, memo } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Card.module.scss';

interface Props extends BareProps {
  headerClassName?: string;
  contentClassName?: string;
  header?: ReactNode;
  divider?: boolean;
  padding?: boolean;
  overflowHidden?: boolean;
}

export const Card: React.FC<Props> = memo(({
  children,
  className,
  contentClassName,
  divider = true,
  header,
  headerClassName,
  overflowHidden = false,
  padding = true
}) => {
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
    <section className={rootClassName}>
      { header ? <div className={clsx(headerClassName, classes.title, { [classes.divider]: divider })}>{header}</div> : null }
      <div className={_contentClassName}>
        {children}
      </div>
    </section>
  );
});

Card.displayName = 'Card';
