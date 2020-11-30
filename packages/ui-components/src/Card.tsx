import React, { ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Card.module.scss';
import styled from 'styled-components';

export interface CardRootProps {
  showShadow?: boolean;
}

export interface CardProps extends BareProps, CardRootProps {
  headerClassName?: string;
  contentClassName?: string;
  header?: ReactNode;
  extra?: ReactNode;
  divider?: boolean;
  padding?: boolean;
  overflowHidden?: boolean;
}

export const CardRoot = styled.section<CardRootProps>`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border: 1px solid var(--color-border);
  box-shadow: ${({ showShadow }): string => showShadow ? '0 1px 20px 0 rgba(23, 65, 212, 0.02);' : 'none'};
`;

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  contentClassName,
  divider = true,
  extra,
  header,
  headerClassName,
  overflowHidden = false,
  padding = true,
  showShadow = true
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
    <CardRoot
      className={rootClassName}
      ref={ref}
      showShadow={showShadow}
    >
      { header ? <div className={clsx(headerClassName, classes.title, { [classes.divider]: divider })}>
        {header}
        {extra ? <div className={classes.extra}>{extra}</div> : null}
      </div> : null }
      <div className={_contentClassName}>
        {children}
      </div>
    </CardRoot>
  );
});

Card.displayName = 'Card';
