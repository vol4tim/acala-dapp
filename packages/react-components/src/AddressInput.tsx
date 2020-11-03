import React, { FC, useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';

import Identicon from '@polkadot/react-identicon';

import { AutoComplete, Input, InputProps, ArrowDownIcon, Tooltip } from '@acala-dapp/ui-components';
import { AddressInfo } from '@acala-dapp/react-environment';
import { useAccounts, useAddressValidator } from '@acala-dapp/react-hooks';

import classes from './AddressInput.module.scss';
import { FormatAddress } from './format';

interface AddressInputProps extends Omit<InputProps, 'onChange'>{
  addressList?: AddressInfo[];
  width?: number;
  onChange: (value: { address: string; error?: string }) => void;
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
  const [error, setError] = useState<string>('');
  const { addAddress, addressList: defaultAddressList } = useAccounts();
  const addressValidator = useAddressValidator({ required: true });

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

    addressValidator(value).then(() => {
      setError('');
      insertOptions(value);
      onChange({ address: value });
    }).catch((e) => {
      setError(e.message);
      onChange({ address: value, error: e.message });
    });
  }, [setValue, addressValidator, insertOptions, onChange]);

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
        error={error}
        inputClassName={clsx(classes.input, inputClassName)}
        prefix={showIdentIcon && !error ? (
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
