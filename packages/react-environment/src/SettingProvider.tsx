import React, { createContext, FC, PropsWithChildren, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { noop } from 'lodash';
import { useModal } from '@acala-dapp/react-hooks';

import { DEFAULT_ENDPOINTS, EndpointConfig } from './utils/endpoints';

export type Language = 'zh' | 'en';
export type Theme = 'normal' | 'dark';
export type Browser = 'firefox' | 'chrome' | 'unknown' | undefined;

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
  selectableEndpoints: EndpointConfig;
  browser: Browser;
  endpoint: string;
  language: 'zh' | 'en' | string;
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
  selectableEndpoints: DEFAULT_ENDPOINTS,
  setLanguage: noop as any,
  setTheme: noop as any,
  settingVisible: false,
  theme: 'normal'
});

export const SettingProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const { close: closeSetting, open: openSetting, status: settingVisible } = useModal();
  const [browser, setBrowser] = useState<Browser>();
  const { setValue: setTheme, value: theme } = useSetting<Theme>('theme', 'normal');
  const { setValue: _setLanguage, value: language } = useSetting<Language>('language', 'en');
  const [endpoint, setEndpoint] = useState<string>('');
  const { i18n } = useTranslation();

  const changeEndpoint = useCallback((endpoint: string, reload?: boolean) => {
    setEndpoint(endpoint);
    window.localStorage.setItem('endpoint', endpoint);

    if (reload) {
      window.location.reload();
    }
  }, [setEndpoint]);

  const setLanguage = useCallback((language: Language) => {
    i18n.changeLanguage(language);
    _setLanguage(language);
  }, [_setLanguage, i18n]);

  // set endpoint
  useEffect(() => {
    // local setting
    const localEndpoint = window.localStorage.getItem('endpoint');

    // get search params from path
    const searchParams = new URLSearchParams(window.location.href.replace(/^.*?\?/, ''));
    const urlEndpoint = searchParams.get('endpoint');

    // if url endpoint exist, use url endpoint and don't store this config
    if (urlEndpoint) {
      setEndpoint(urlEndpoint);

      return;
    }

    if (localEndpoint && /wss?:\/\//.test(localEndpoint)) {
      setEndpoint(localEndpoint);

      return;
    }

    setEndpoint(DEFAULT_ENDPOINTS.testnet[0].url);
  }, [setEndpoint]);

  // set browser type
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
        selectableEndpoints: DEFAULT_ENDPOINTS,
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
