import React, { FC, ReactNode, useState, useEffect, useMemo, Children, ReactElement, useRef, Dispatch, SetStateAction, createRef } from 'react';

import { BareProps } from './types';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';

function useTabs<T = string | number> (defaultTab: T): { currentTab: T; changeTabs: Dispatch<SetStateAction<T>>} {
  const [currentTab, changeTabs] = useState<T>(defaultTab);

  return useMemo(() => ({
    changeTabs,
    currentTab
  }), [currentTab, changeTabs]);
}

interface PanelProps extends BareProps {
  tab: ReactNode | ((active: boolean, disabled?: boolean, onClick?: () => void) => ReactNode);
  $key: string | number;
  disabled?: boolean;
}

export const Panel: FC<PanelProps> = () => null;

const TabContainer = styled.div`
  width: 100%;
`;

export const TabTitleContainer = styled.ul<{ showBorder: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  list-style: none;
  border-bottom: ${({ showBorder }): string => showBorder ? '1px solid var(--tab-border)' : 'none'};
`;

export const TabTitle = styled.li<{
  active: boolean;
  disabled: boolean;
}>`
  position: relative;
  flex-shink: 0;
  flex-grow: 0;
  padding: 16px 8px;
  margin: 0 58px 0 0;
  font-size: var(--text-size-md);
  font-weight: var(--text-weight-md);
  line-height: 1.3125;
  color: ${({ active }): string => active ? 'var(--color-primary)' : 'var(--text-color-normal)'};
  user-select: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% + 58px);
    height: 100%;
    transition: opacity 0.2s;
    background: var(--color-primary);
    opacity: 0;
    cursor: ${({ disabled }): string => disabled ? 'not-allowed' : 'pointer'};
  }

  &:hover::after {
    opacity: 0.2;
  }
`;

export const CardTabTitle = styled.div<{
  active: boolean;
  disabled?: boolean;
}>`
  flex: 1;
  text-align: center;
  font-size: 20px;
  line-height: 24px;
  padding: 20px 0;
  font-weight: 500;
  background: ${({ active }): string => active ? '#ffffff' : '#ECF0F2'};
  cursor: ${({ disabled }): string => disabled ? 'not-allowed' : 'pointer'};
`;

const Slider = styled.div`
  position: absolute;
  bottom: 0;
  height: 2px;
  background: var(--color-primary);
`;

const ActiveSlider: FC<{ index: number }> = ({ index }) => {
  const ref = createRef<HTMLDivElement>();
  const prevIndex = useRef<number>(0);
  const [prevLeft, setPrevLeft] = useState<number>(0);
  const [currentLeft, setCurrentLeft] = useState<number>(0);
  const [prevWidth, setPrevWidth] = useState<number>(0);
  const [currentWidth, setCurrentWidth] = useState<number>(0);

  useEffect(() => {
    if (!ref) return;

    const $dom = ref.current;

    // get and set dom position information
    const $container = $dom?.parentNode;
    const $tabList = $container?.querySelectorAll('li');

    if (!$tabList?.length) return;

    setPrevWidth($tabList[prevIndex.current]?.clientWidth ?? 0);
    setCurrentWidth($tabList[index]?.clientWidth ?? 0);
    setPrevLeft($tabList[prevIndex.current]?.offsetLeft ?? 0);
    setCurrentLeft($tabList[index]?.offsetLeft ?? 0);

    // update prev index
    prevIndex.current = index;
  }, [ref, index]);

  // doesn't show animation when first render
  if (prevWidth === 0 && prevLeft === 0) {
    return (
      <Slider
        ref={ref}
        style={{ left: currentLeft + 'px', width: currentWidth + 'px' }}
      />
    );
  }

  return (
    <Motion
      defaultStyle={{ left: prevLeft, width: prevWidth }}
      style={{ left: spring(currentLeft), width: spring(currentWidth) }}
    >
      {
        (style): JSX.Element => {
          return (
            <Slider
              ref={ref}
              style={{ left: style.left + 'px', width: style.width + 'px' }}
            />
          );
        }
      }
    </Motion>
  );
};

const TabContent = styled.div`
  margin-top: 24px;
`;

interface TabsProps<T> extends BareProps {
  className?: string;
  tabClassName?: string;
  active: T | string | number;
  onChange?: ((key: T | string | number) => void) | React.Dispatch<React.SetStateAction<T>>;
  showTabsContainerBorderLine?: boolean;
}

function Tabs<T> ({
  active,
  children,
  onChange,
  showTabsContainerBorderLine = true
}: TabsProps<T>): JSX.Element {
  const [tabList, panelList, keyList, disabledList] = useMemo(() => {
    if (!children) return [[], [], [], []];

    const tabList: ReactNode[] = [];
    const panelList: ReactNode[] = [];
    const disabledList: boolean[] = [];
    const keyList: T[] = [];

    Children.forEach(children, (child) => {
      if (child && typeof child === 'object' && Reflect.has(child, 'key')) {
        tabList.push((child as ReactElement<PanelProps>).props.tab);
        panelList.push((child as ReactElement<PanelProps>).props.children);
        keyList.push((child as ReactElement<PanelProps>).props.$key as unknown as T);
        disabledList.push(!!(child as ReactElement<PanelProps>).props.disabled);
      }
    });

    return [tabList, panelList, keyList, disabledList] as unknown as [ReactNode[], ReactNode[], T[], boolean[]];
  }, [children]);

  const activeTabIndex = useMemo(() => {
    return keyList?.findIndex((item) => item === active) ?? 0;
  }, [keyList, active]);

  const firstKey = useMemo(() => keyList[0], [keyList]);

  return (
    <TabContainer>
      <TabTitleContainer showBorder={showTabsContainerBorderLine}>
        {
          tabList?.map((tab, index) => (
            typeof tab === 'function' ? tab(
              activeTabIndex === index,
              disabledList[activeTabIndex],
              (): unknown => !disabledList[index] && onChange && onChange(keyList ? keyList[index] : firstKey)
            ) : <TabTitle
              active={activeTabIndex === index}
              disabled={disabledList[index]}
              key={`tab-${tab?.toString()}-${index}`}
              onClick={(): unknown => !disabledList[index] && onChange && onChange(keyList ? keyList[index] : firstKey) }
            >
              {tab}
            </TabTitle>
          ))
        }
        <ActiveSlider index={activeTabIndex} />
      </TabTitleContainer>
      <TabContent>
        {panelList[activeTabIndex]}
      </TabContent>
    </TabContainer>
  );
}

Tabs.Panel = Panel;

export { useTabs, Tabs };
