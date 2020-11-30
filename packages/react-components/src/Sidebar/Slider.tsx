import React, { FC, useEffect, useState } from 'react';
import { Motion, spring } from 'react-motion';
import { styled } from '@acala-dapp/ui-components';

const SliderRoot = styled.div<{ top: number }>`
  position: absolute;
  left: 0;
  top: ${({ top }): number => top}px;
  width: 5px;
  height: var(--sidebar-item-height);
  background: var(--color-primary);
`;

interface SliderProps {
  target: HTMLElement | null;
}

export const Slider: FC<SliderProps> = ({ target }) => {
  const [currentTop, setCurrentTop] = useState<number>(0);

  useEffect(() => {
    if (!target) return;

    const { top } = target.getBoundingClientRect();

    setCurrentTop(top);
  }, [target, setCurrentTop]);

  if (!currentTop) return null;

  return (
    <Motion
      defaultStyle={{ top: currentTop }}
      style={{ top: spring(currentTop) }}
    >
      {(style): JSX.Element => (<SliderRoot top={style.top} />)}
    </Motion>
  );
};
