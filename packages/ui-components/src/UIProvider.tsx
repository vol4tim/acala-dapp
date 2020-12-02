import React, { FC, useState } from 'react';

import 'antd/dist/antd.css';
import './styles/index.scss';
import './styles/global.css';
import { BareProps } from './types';

export interface UIData {
  phantomdata: any;
}

export const UIContext = React.createContext<UIData>({ phantomdata: '' });

export const UIProvider: FC<BareProps> = ({ children }) => {
  const [state] = useState<UIData>({ phantomdata: '' });

  return (
    <UIContext.Provider value={state}>
      {children}
    </UIContext.Provider>
  );
};
