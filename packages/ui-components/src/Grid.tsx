import React, { FC, useMemo } from 'react';
import { Row, Col } from 'antd';
import { BareProps } from './types';

interface ResponsedConfig {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

export interface GridProps extends BareProps {
  align?: 'top' | 'middle' | 'bottom';
  justity?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  container?: boolean;

  baseGutter?: number;
  item?: boolean;
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  span?: number | ResponsedConfig;
}

export const Grid: FC<GridProps> = ({
  align,
  baseGutter = 8,
  children,
  className,
  container,
  item = false,
  justity,
  spacing = 3,
  span = 24
}) => {
  const gutter = useMemo<[number, number]>((): [number, number] => {
    return [baseGutter * spacing, baseGutter * spacing];
  }, [baseGutter, spacing]);

  const spanProps = useMemo(() => {
    if (typeof span === 'number' || typeof span === 'string') {
      return { span };
    }

    if (typeof span === 'object') {
      return { ...span };
    }

    return {};
  }, [span]);

  if (container && item) {
    return (
      <Col
        className={className}
        {...spanProps}
      >
        <Row
          align={align}
          gutter={gutter}
          justify={justity}
          style={{ marginBottom: -gutter[1] / 2 }}
        >
          {children}
        </Row>
      </Col>
    );
  }

  if (container) {
    return (
      <Row
        align={align}
        className={className}
        gutter={gutter}
        justify={justity}
        style={{ marginBottom: -gutter[1] / 2 }}
      >{children}</Row>
    );
  }

  return (
    <Col
      className={className}
      {...spanProps}
    >
      {children}
    </Col>
  );
};
