import React, { FC, useState, useEffect } from 'react';
import { debounce } from 'lodash';

import 'antd/dist/antd.css';
import './styles/index.scss';
import './styles/global.css';
import { BareProps } from './types';

export type BreakPoint = 'sm' | 'md' | 'lg'

const setFontSize = (basicUnit = 10, defaultViewPortWidth = 1440): void => {
  document.documentElement.style.fontSize = basicUnit / defaultViewPortWidth * 100 + 'vw';
};

const breakpointConfig: Record<BreakPoint, number> = {
  lg: 1920,
  md: 1440,
  sm: 960
};

export interface UIData {
  breakpoint: BreakPoint;
}

export const UIContext = React.createContext<UIData>({ breakpoint: 'lg' });

export const UIProvider: FC<BareProps> = ({ children }) => {
  const [breakpoint, setBreakpoint] = useState<BreakPoint>('lg');
  const [isUIReady, setUIReady] = useState<boolean>(false);

  useEffect(() => {
    const inner = debounce((): void => {
      const windowWidth = document.documentElement.clientWidth;

      setBreakpoint(windowWidth > breakpointConfig.sm ? windowWidth > breakpointConfig.md ? 'lg' : 'md' : 'sm');
    });

    inner();
    window.addEventListener('resize', inner);

    return (): void => {
      window.removeEventListener('resize', inner);
    };
  }, []);

  useEffect(() => {
    setFontSize();
    setUIReady(true);
  }, []);

  if (!isUIReady) return null;

  return (
    <UIContext.Provider value={{ breakpoint }}>
      {children}
    </UIContext.Provider>
  );
};
