import React, { useState, useEffect, useRef, createContext, FC, useCallback, memo, ReactNode, useMemo } from 'react';
import { uniqWith } from 'lodash';

import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { useModal, useApi, useStorage } from '@acala-dapp/react-hooks';
import { SelectAccount, isValidateAddress } from '@acala-dapp/react-components';
import { BareProps } from '@acala-dapp/ui-components/types';

type AccountProviderError = 'NO_EXTENSIONS' | 'NO_ACCOUNTS' | '';

const ACTIVE_ACCOUNT_KEY = 'active-account';

const ADDRESS_LIST_KEY = 'saved_address_list';

export const AccountContext = createContext<AccountsData>({} as AccountsData);

export interface AddressInfo {
  address: string;
  meta?: {
    name?: string;
  };
}

export interface AccountsData {
  authRequired: boolean;
  setAuthRequired: React.Dispatch<React.SetStateAction<boolean>>;
  active: InjectedAccountWithMeta | null;
  accounts: InjectedAccountWithMeta[];
  error: AccountProviderError;
  ready: boolean;
  openSelectAccount: () => void;
  closeSelectAccount: () => void;
  addressList: AddressInfo[];
  addAddress: (value: string) => void;
}

interface Props extends BareProps {
  applicationName: string;
  NoAccounts?: ReactNode;
  NoExtensions?: ReactNode;
}

export const AccountProvider: FC<Props> = memo(({
  NoAccounts,
  NoExtensions,
  applicationName = 'acala-dapp Platform',
  children
}) => {
  const { api } = useApi();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [active, setActive] = useState<InjectedAccountWithMeta | null>(null);
  const [error, setError] = useState<AccountProviderError>('');
  const [ready, setReady] = useState<boolean>(false);
  const [addressList, setAddressList] = useState<string[]>([]);
  const [authRequired, setAuthRequired] = useState<boolean>(true);
  const addressListRef = useRef<string[]>([]);
  const { getStorage, setStorage } = useStorage({ useAccountPrefix: false });
  const { close, open, status } = useModal(false);

  const loadAccounts = useCallback(async (): Promise<InjectedAccountWithMeta[]> => {
    const injected = await web3Enable(applicationName);

    if (!injected.length) {
      throw new Error('NO_EXTENSIONS');
    }

    const accounts = await web3Accounts();

    if (!accounts.length) {
      throw new Error('NO_ACCOUNTS');
    }

    return accounts;
  }, [applicationName]);

  const setActiveAccount = useCallback(async (account: InjectedAccountWithMeta): Promise<void> => {
    if (!api) return;

    try {
      const injector = await web3FromAddress(account.address);

      api.setSigner(injector.signer);
      setActive(account);
      setReady(true);
      setStorage(ACTIVE_ACCOUNT_KEY, account.address);
    } catch (e) {
      setReady(false);
    }
  }, [api, setActive, setReady, setStorage]);

  const addAddress = useCallback((value: string) => {
    if (!isValidateAddress(value)) return;

    const isExist = addressListRef.current.find((address): boolean => address === value);

    if (!isExist) {
      addressListRef.current.push(value);
      setStorage(ADDRESS_LIST_KEY, JSON.stringify(addressListRef.current));
      setAddressList([...addressListRef.current]);
    }
  }, [setAddressList, setStorage]);

  const _addressList = useMemo<AddressInfo[]>((): AddressInfo[] => {
    const result = [
      ...accounts,
      ...addressList.map((address) => {
        return { address };
      })
    ];

    return uniqWith(result, (a, b) => a.address === b.address);
  }, [accounts, addressList]);

  const handleAccountSelect = useCallback(async (account: InjectedAccountWithMeta): Promise<void> => {
    await setActiveAccount(account);
    close();
  }, [setActiveAccount, close]);

  const renderError = useCallback((): ReactNode => {
    if (!authRequired) return null;

    if (error && error === 'NO_ACCOUNTS' && NoAccounts) {
      return NoAccounts;
    }

    if (error && error === 'NO_EXTENSIONS' && NoExtensions) {
      return NoExtensions;
    }

    return null;
  }, [authRequired, error, NoAccounts, NoExtensions]);

  useEffect(() => {
    loadAccounts()
      .then(async (accounts) => {
        setAccounts(accounts);

        if (!accounts.length || active) {
          return;
        }

        // check saved active account
        const savedActiveAccountAddress = getStorage(ACTIVE_ACCOUNT_KEY);
        const savedActiveAccount = accounts.find((item): boolean => item.address === savedActiveAccountAddress);

        if (savedActiveAccount) {
          await setActiveAccount(savedActiveAccount);
        } else if (accounts.length === 1) {
          await setActiveAccount(accounts[0]);
        } else {
          open();
        }
      })
      .catch((e: Error) => {
        setError(e.message as AccountProviderError);
      });
  }, [loadAccounts, setError, active, getStorage, open, setActiveAccount]);

  useEffect(() => {
    const list = getStorage(ADDRESS_LIST_KEY);

    try {
      const options = JSON.parse(list as string) as string[] || [];

      setAddressList(options);
      addressListRef.current = options;
    } catch (_e) {
      // swallow error
    }
  }, [getStorage, setAddressList]);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        active,
        addAddress,
        addressList: _addressList,
        authRequired,
        closeSelectAccount: close,
        error,
        openSelectAccount: open,
        ready,
        setAuthRequired
      }}
    >
      <SelectAccount
        accounts={accounts}
        defaultAccount={active ? active.address : undefined}
        onSelect={handleAccountSelect}
        visable={status}
      />
      {children}
      {renderError()}
    </AccountContext.Provider>
  );
});

AccountProvider.displayName = 'AccountProvider';
