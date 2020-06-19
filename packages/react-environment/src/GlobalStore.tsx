import React, { createContext, useState, FC, PropsWithChildren, useCallback, useRef, useEffect } from 'react';
import { useStorage } from '@acala-dapp/react-hooks';
import { isValidateAddress } from '@acala-dapp/react-components';

interface StoreContextData {
  store: { [k: string]: any };
  setStore: (key: string, value: any) => void;
  addressList: string[];
  addAddress: (value: string) => void;
}

const KEY = 'saved_address_list';

export const globalStoreContext = createContext<StoreContextData>({} as any as StoreContextData);

export const GlobalStoreProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const [store, _setStore] = useState({});
  const storeRef = useRef<{[k in string]: any}>({});
  const [addressList, setAddressList] = useState<string[]>([]);
  const addressListRef = useRef<string[]>([]);
  const { getStorage, setStorage } = useStorage({ useAccountPrefix: false });
  const setStore = useCallback((key: string, value: any): void => {
    storeRef.current[key] = value;

    _setStore({ ...storeRef.current });
  }, [_setStore]);

  useEffect(() => {
    const list = getStorage(KEY);

    try {
      const options = JSON.parse(list as string) as string[] || [];

      setAddressList(options);
      addressListRef.current = options;
    } catch (_e) {
      // swallow error
    }
  }, [getStorage, setAddressList]);

  const addAddress = useCallback((value: string) => {
    if (!isValidateAddress(value)) return;

    const isExist = addressListRef.current.find((address): boolean => address === value);

    if (!isExist) {
      addressListRef.current.push(value);
    }

    setStorage(KEY, JSON.stringify(addressListRef.current));
    setAddressList([...addressListRef.current]);
  }, [setAddressList, setStorage]);

  return (
    <globalStoreContext.Provider value={{
      addAddress,
      addressList,
      setStore,
      store
    }}>
      {children}
    </globalStoreContext.Provider>
  );
};
