import React, { createContext, FC, PropsWithChildren, useState, useEffect, useCallback } from 'react';
import { noop } from 'lodash';

import { useModal } from '@acala-dapp/react-hooks';

import { DEFAULT_ENDPOINTS } from './utils/endpoints';

type Language = 'zh' | 'en';
type Theme = 'normal' | 'dark';
type Browser = 'firefox' | 'chrome' | 'unknown' | undefined;

function useSetting<T> (key: string, defaultValue?: T): { value: T; setValue: (value: T) => void } {
  const [value, _setValue] = useState<T>();

  const setValue = useCallback((value: T): void => {
    window.localStorage.setItem(key, value as any as string);
    _setValue(value);
  }, [_setValue, key]);

  useEffect(() => {
    const storaged = window.localStorage.getItem(key);

    if (storaged) {
      _setValue(storaged as any as T);
    } else if (defaultValue) {
      _setValue(defaultValue);
    }
  /* eslint-disable-next-line  react-hooks/exhaustive-deps */
  }, [_setValue, defaultValue]);

  return { setValue, value: value as any as T };
}

export interface SettingDate {
  browser: Browser;
  endpoint: string;
  language: 'zh' | 'en';
  theme: 'normal' | 'dark';
  changeEndpoint: (endpoints: string) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;

  settingVisible: boolean;
  openSetting: () => void;
  closeSetting: () => void;
}

export const SettingContext = createContext<SettingDate>({
  browser: 'unknown',
  changeEndpoint: noop as any,
  closeSetting: noop,
  endpoint: '',
  language: 'en',
  openSetting: noop,
  setLanguage: noop as any,
  setTheme: noop as any,
  settingVisible: false,
  theme: 'normal'
});

export const SettingProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const { close: closeSetting, open: openSetting, status: settingVisible } = useModal();
  const [browser, setBrowser] = useState<Browser>();
  const { setValue: setTheme, value: theme } = useSetting<Theme>('theme', 'normal');
  const { setValue: setLanguage, value: language } = useSetting<Language>('language', 'en');
  const [endpoint, setEndpoint] = useState<string>('');

  const changeEndpoint = useCallback((endpoint: string, reload?: boolean) => {
    setEndpoint(endpoint);
    window.localStorage.setItem('endpoint', endpoint);

    if (reload) {
      window.location.reload();
    }
  }, [setEndpoint]);

  useEffect(() => {
    // local setting
    const localEndpoint = window.localStorage.getItem('endpoint');

    // get search params from path
    const searchParams = new URLSearchParams(window.location.href.replace(/^.*?\?/, ''));
    const urlEndpoint = searchParams.get('endpoint');

    // if url endpoint exist, choose url endpoint
    if (urlEndpoint) {
      setEndpoint(urlEndpoint);

      return;
    }

    if (localEndpoint && /wss?:\/\//.test(localEndpoint)) {
      setEndpoint(localEndpoint);

      return;
    }

    setEndpoint(DEFAULT_ENDPOINTS[0].url);
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
        changeEndpoint,
        closeSetting,
        endpoint,
        language,
        openSetting,
        setLanguage,
        setTheme,
        settingVisible,
        theme
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};
