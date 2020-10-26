import React, { FC, useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';

import Identicon from '@polkadot/react-identicon';

import { AutoComplete, Input, InputProps, ArrowDownIcon, Tooltip } from '@acala-dapp/ui-components';
import { AddressInfo } from '@acala-dapp/react-environment';
import { useAccounts } from '@acala-dapp/react-hooks';

import classes from './AddressInput.module.scss';
import { isValidateAddress } from './utils';
import { FormatAddress } from './format';

interface AddressInputProps extends Omit<InputProps, 'onChange'>{
  addressList?: AddressInfo[];
  width?: number;
  onChange: (address: string) => void;
  showIdentIcon?: boolean;
  inputClassName?: string;
  blockAddressList?: string[];
}

/**
 * @name AddressInput
 * @description input and auto select account
 */
export const AddressInput: FC<AddressInputProps> = ({
  addressList,
  blockAddressList = [],
  inputClassName,
  onChange,
  showIdentIcon,
  width,
  ...other
}) => {
  const [value, setValue] = useState<string>('');
  const [isValided, setIsValided] = useState<boolean>(false);
  const { addAddress, addressList: defaultAddressList } = useAccounts();

  const _addressList = useMemo((): AddressInfo[] => {
    if (addressList) return addressList;

    if (defaultAddressList) return defaultAddressList;

    return [];
  }, [addressList, defaultAddressList]);

  const options = useMemo(() => {
    return _addressList
      .filter((item) => !blockAddressList.includes(item.address))
      .map((item) => {
        return {
          label: (
            <Tooltip
              mouseEnterDelay={0.5}
              title={item.address}
            >
              <div className={classes.option}>
                <Identicon
                  className={classes.identicon}
                  size={32}
                  value={item.address}
                />
                <div>
                  {item?.meta?.name ? <p>{item.meta.name}</p> : null}
                  <FormatAddress address={item.address} />
                </div>
              </div>
            </Tooltip>
          ),
          value: item.address
        };
      });
  }, [_addressList, blockAddressList]);

  const insertOptions = useCallback((value: string) => {
    addAddress(value);
  }, [addAddress]);

  const _setValue = useCallback((value: string): void => {
    setValue(value);
    onChange(value);

    if (isValidateAddress(value)) {
      setIsValided(true);
      insertOptions(value);
    } else {
      setIsValided(false);
    }
  }, [setValue, setIsValided, insertOptions, onChange]);

  const handleChange = useCallback((value: string) => {
    _setValue(value);
  }, [_setValue]);

  const handleSelect = useCallback((value: string): void => {
    _setValue(value);
  }, [_setValue]);

  return (
    <AutoComplete
      onChange={handleChange}
      onSelect={handleSelect}
      options={options}
      style={{ width }}
    >
      <Input
        inputClassName={clsx(classes.input, inputClassName)}
        prefix={showIdentIcon && isValided ? (
          <Identicon
            className={classes.icon}
            size={32}
            value={value}
          />
        ) : undefined}
        suffix={<ArrowDownIcon />}
        {...other}
      />
    </AutoComplete>
  );
};
