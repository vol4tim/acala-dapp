import React, { createContext, useState, FC, PropsWithChildren, useCallback, useRef } from 'react';

interface StoreContextData {
  store: { [k: string]: any };
  setStore: (key: string, value: any) => void;
}

export const globalStoreContext = createContext<StoreContextData>({} as any as StoreContextData);

export const GlobalStoreProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const [store, _setStore] = useState({});
  const storeRef = useRef<{[k in string]: any}>({});
  const setStore = useCallback((key: string, value: any): void => {
    storeRef.current[key] = value;

    _setStore({ ...storeRef.current });
  }, [_setStore]);

  return (
    <globalStoreContext.Provider value={{
      setStore,
      store
    }}>
      {children}
    </globalStoreContext.Provider>
  );
};
