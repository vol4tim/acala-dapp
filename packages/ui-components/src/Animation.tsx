import React, { FC, PropsWithChildren } from 'react';
import { Motion, spring, presets } from 'react-motion';

export const Fadein: FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <Motion
      defaultStyle={{ opacity: 0 }}
      style={{ opacity: spring(1, presets.gentle) }}
    >
      {
        (style): JSX.Element => (<div style={{ height: '100%', opacity: style.opacity, width: '100%' }}>{children}</div>)
      }
    </Motion>
  );
};
