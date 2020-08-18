import React, { createContext, FC, PropsWithChildren, useState, useEffect, useCallback } from 'react';
import { noop } from 'lodash';
import { EndpointConfig, DEFAULT_ENDPOINTS } from './utils/endpoints';

type Language = 'zh' | 'en';
type Theme = 'normal' | 'dark';
type Browser = 'firefox' | 'chrome' | 'unknown' | undefined;

function useSetting<T> (key: string, defaultValue?: T): { value: T; setValue: (value: T) => void } {
  const [value, _setValue] = useState<T>(defaultValue as T);

  const setValue = useCallback((value: T): void => {
    window.localStorage.setItem(key, value as any as string);
    _setValue(value);
  }, [_setValue, key]);

  useEffect(() => {
    const storaged = window.localStorage.getItem(key);

    if (storaged) {
      _setValue(storaged as any as T);
    }
  /* eslint-disable-next-line  react-hooks/exhaustive-deps */
  }, []);

  return { setValue, value };
}

export interface SettingDate {
  browser: Browser;
  endpoint: EndpointConfig[];
  language: 'zh' | 'en';
  theme: 'normal' | 'dark';
  setEndpoint: (endpoints: EndpointConfig[]) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
}

export const SettingContext = createContext<SettingDate>({
  browser: 'unknown',
  endpoint: [],
  language: 'en',
  setEndpoint: noop as any,
  setLanguage: noop as any,
  setTheme: noop as any,
  theme: 'normal'
});

export const SettingProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const [browser, setBrowser] = useState<Browser>();
  const { setValue: setTheme, value: theme } = useSetting<Theme>('theme', 'normal');
  const { setValue: setLanguage, value: language } = useSetting<Language>('language', 'en');
  const [endpoint, setEndpoint] = useState<EndpointConfig[]>([]);

  useEffect(() => {
    // get search params from path
    const searchParams = new URLSearchParams(window.location.href.replace(/^.*?\?/, ''));
    const endpoint = searchParams.get('endpoint');

    if (endpoint) {
      setEndpoint([{ name: '', url: endpoint }]);
    } else {
      setEndpoint(DEFAULT_ENDPOINTS);
    }
  }, [setEndpoint]);

  useEffect(() => {
    if (window.navigator.userAgent.includes('Firefox')) {
      setBrowser('firefox');

      return;
    }

    if (window.navigator.userAgent.includes('Chrome')) {
      setBrowser('chrome');

      return;
    }

    setBrowser('unknown');
  }, []);

  return (
    <SettingContext.Provider
      value={{
        browser,
        endpoint,
        language,
        setEndpoint,
        setLanguage,
        setTheme,
        theme
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};
