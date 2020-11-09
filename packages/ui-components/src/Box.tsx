import React, { FC, useMemo, ReactElement, ReactNode, useCallback, isValidElement, cloneElement } from 'react';
import CSS from 'csstype';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Box.module.scss';
import styled from 'styled-components';
import { style } from 'd3';

export const InlineBlockBox: FC<{ margin: number } & BareProps> = ({ children, className, margin }) => {
  return (
    <div className={clsx(classes.inlineBlockBox, className)}
      style={{
        margin: `0 ${margin}px`
      }}
    >
      {children}
    </div>
  );
};

export const SpaceBetweenBox: FC<BareProps> = ({ children, className }) => {
  return (
    <div className={clsx(classes.spaceBetweenBox, className)}>
      {children}
    </div>
  );
};

export const AlignCenterBox: FC<BareProps> = ({ children, className }) => {
  return (
    <div className={clsx(classes.alignCenterBox, className)}>
      {children}
    </div>
  );
};

interface FlexBoxProps extends BareProps {
  alignItems: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'center';
  justifyContent: 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

export const FlexBox: FC<FlexBoxProps> = styled.div`
  display: flex;
  justify-content: ${({ justifyContent }: FlexBoxProps): string => justifyContent || 'flex-start'};
  align-items: ${({ alignItems }: FlexBoxProps): string => alignItems || 'center'};
`;

interface PaddingBoxProps extends BareProps {
  inline?: boolean;
  padding: number | string;
}

export const PaddingBox: FC<PaddingBoxProps> = styled.div`
  display: ${({ inline }: PaddingBoxProps): string => inline ? 'inline-block' : 'block'};
  padding: ${({ padding }: PaddingBoxProps): string => typeof padding === 'number' ? padding + 'px' : padding};
`;

interface GridBoxProps extends BareProps {
  column: number;
  row: number | 'auto';
  padding?: number;
}

export const GridBox: FC<GridBoxProps> = ({
  children,
  className,
  column,
  padding = 16,
  row
}) => {
  const style = useMemo<CSS.Properties>((): CSS.Properties => {
    return {
      gridTemplateColumns: `repeat(${column}, 1fr)`,
      gridTemplateRows: row === 'auto' ? 'auto' : `repeat(${row}, 1fr)`,
      margin: `-${padding}px -${padding}px 0 0`
    };
  }, [row, column, padding]);

  const justifyChild = useCallback((child: ReactNode): ReactNode => {
    if (isValidElement(child)) {
      child = child as ReactElement;

      return cloneElement(child, {
        style: {
          ...child?.props?.style,
          margin: `${padding}px ${padding}px 0 0`
        }
      });
    }

    return child;
  }, [padding]);

  return (
    <div
      className={clsx(classes.gridBox, className)}
      style={style}
    >
      {
        React.Children.map(children, justifyChild)
      }
    </div>
  );
};
