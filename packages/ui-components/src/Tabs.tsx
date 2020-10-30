import React, { FC, ReactNode, useState, useEffect, useMemo, Children, useCallback, ReactElement, useRef, Dispatch, SetStateAction } from 'react';
import { has, get } from 'lodash';
import clsx from 'clsx';
import { Motion, spring, presets } from 'react-motion';

import { BareProps } from './types';
import './Tabs.scss';

function useTabs<T> (defaultTab: T): { currentTab: T; changeTabs: Dispatch<SetStateAction<T>>} {
  const [currentTab, changeTabs] = useState<T>(defaultTab);
  const result = useMemo(() => ({
    changeTabs,
    currentTab
  }), [currentTab, changeTabs]);

  return result;
}

type TabsType = 'button' | 'line' | 'card';
type TabsSize = 'large' | 'normal' | 'small';

interface PanelProps extends BareProps {
  tab: ReactNode;
  key: string | number;
  disabled?: boolean;
}

export const Panel: FC<PanelProps> = ({ children }) => {
  return (
    <div>{children}</div>
  );
};

interface TabsProps extends BareProps {
  type?: TabsType;
  size?: TabsSize;
  className?: string;
  tabClassName?: string;
  defaultKey?: string | number;
  onChange?: (key: string | number | any) => void;
}

type TabsComponent = FC<TabsProps> & { Panel: FC<PanelProps> };
type PanelAttr = Pick<PanelProps, 'key' | 'tab' | 'disabled'>;

const _Tabs: FC<TabsProps> = ({
  children,
  className,
  defaultKey,
  onChange,
  size,
  tabClassName,
  type
}) => {
  const [active, setActive] = useState<string | number>('');
  const rootClass = clsx('aca-tabs', `aca-tabs--${type}`, `aca-tabs--${size}`, className);
  const tabClassF = (active: boolean, disabled?: boolean): string => clsx('aca-tabs__tab', tabClassName, { active: active, disabled: disabled });
  const defaultKeyCatch = useRef<string | number>();

  // extact panels config
  const panels = useMemo<PanelAttr[]>((): PanelAttr[] => {
    if (!children) return [];

    const result = Children.map(children, (child): PanelAttr | undefined => {
      if (!child) return;

      if (has(child, 'key')) {
        return {
          disabled: (child as ReactElement<PanelProps>).props.disabled,
          key: (child as ReactElement<PanelProps>).key || '',
          tab: (child as ReactElement<PanelProps>).props.tab
        };
      }

      // console.warn('Tabs children need an unique key');

      return undefined;
    });

    return result ? result.filter((item): boolean => !!item) : [];
  }, [children]);

  // get active panel component
  const activePanel = useMemo((): ReactNode => {
    let result: ReactNode = '';

    Children.forEach(children, (child): void => {
      if (get(child, 'key') === active) {
        result = child;
      }
    });

    return result;
  }, [active, children]);

  const changeActive = useCallback((_active: string | number) => {
    setActive(_active);
    onChange && onChange(_active);
  }, [setActive, onChange]);

  const handleTabClick = useCallback((active: string | number, disabled?: boolean): void => {
    if (disabled) return;

    changeActive(active);
  }, [changeActive]);

  // set default panel when panels exists and active isn't setted.
  useEffect(() => {
    if (panels.length >= 1 && active === '') {
      const key = defaultKey || panels[0].key;

      changeActive(key);
    }

    if (defaultKey && defaultKey !== defaultKeyCatch.current) {
      changeActive(defaultKey);
    }

    defaultKeyCatch.current = defaultKey;
  }, [active, defaultKey, panels, changeActive]);

  return (
    <div className={rootClass}>
      <ul className='aca-tabs__tabs'>
        {
          panels.map((item: PanelAttr): ReactNode => (
            <li
              className={tabClassF(item.key === active, item.disabled)}
              key={`tabs-${item.key}`}
              onClick={(): void => handleTabClick(item.key, item.disabled)}
            >
              {item.tab}
            </li>
          ))
        }
      </ul>
      <Motion
        defaultStyle={{ opacity: 0 }}
        key={active}
        style={{ opacity: spring(1, presets.gentle) }}
      >
        {
          (interpolatedStyle): JSX.Element => (
            <div className='aca-tabs__content'
              style={{ opacity: interpolatedStyle.opacity }}
            >
              {activePanel}
            </div>
          )
        }
      </Motion>
    </div>
  );
};

(_Tabs as any).Panel = Panel;

const Tabs = _Tabs as TabsComponent;

Tabs.Panel = Panel;

export { useTabs, Tabs };
