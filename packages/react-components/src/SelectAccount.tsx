import React, { useState, useCallback, useEffect } from 'react';

import Identicon from '@polkadot/react-identicon';
import { Dialog } from '@acala-dapp/ui-components';

import { ReactComponent as CheckedIcon } from './assets/checked.svg';
import classes from './SelectAccount.module.scss';
import { InjectedAccount } from '@polkadot/extension-inject/types';

interface Props {
  defaultAccount?: string;
  accounts: InjectedAccount[];
  visable: boolean;
  onSelect?: (account: InjectedAccount) => void;
  onCancel: () => void;
}

export const SelectAccount: React.FC<Props> = ({
  accounts,
  defaultAccount,
  onCancel,
  onSelect,
  visable
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const confirmHandler = useCallback(() => {
    onSelect && onSelect(accounts[selectedIndex]);
  }, [onSelect, accounts, selectedIndex]);

  useEffect(() => {
    if (!defaultAccount || !accounts.length) return;

    const defaultIndex = accounts.findIndex((item) => item.address === defaultAccount);

    setSelectedIndex(defaultIndex);
  }, [defaultAccount, accounts, setSelectedIndex]);

  return (
    <Dialog
      className={classes.root}
      onCancel={onCancel}
      onConfirm={confirmHandler}
      title='Choose Account'
      visiable={visable}
      withClose
    >
      <ul className={classes.list}>
        {
          accounts.map((item, index) => {
            return (
              <li
                className={classes.item}
                key={`account-${item.address}`}
                onClick={(): void => setSelectedIndex(index)}
              >
                <Identicon
                  className={classes.icon}
                  size={16}
                  value={item.address}
                />
                <p className={classes.account}>{item.name}</p>
                <div className={classes.checked}>
                  {
                    selectedIndex === index ? <CheckedIcon /> : null
                  }
                </div>
              </li>
            );
          })
        }
      </ul>
    </Dialog>
  );
};
