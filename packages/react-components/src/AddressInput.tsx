import React, { FC, useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';

import { AutoComplete, Input, InputProps, ArrowDownIcon } from '@acala-dapp/ui-components';
import Identicon from '@polkadot/react-identicon';
import { useAccounts } from '@acala-dapp/react-hooks';

import classes from './AddressInput.module.scss';
import { isValidateAddress, formatAddress as format } from './utils';
import { FormatAddress } from './format';

interface AddressInputProps extends Omit<InputProps, 'onError' | 'onChange'>{
  width?: number;
  onChange: (address: string) => void;
  onError: (error: boolean) => void;
  showIdentIcon?: boolean;
  inputClassName?: string;
  blockAddressList?: string[];
  formatAddress?: boolean;
}

/**
 * @name AddressInput
 * @description input and auto select account
 */
export const AddressInput: FC<AddressInputProps> = ({
  blockAddressList = [],
  inputClassName,
  formatAddress = true,
  onChange,
  onError,
  showIdentIcon,
  width,
  ...other
}) => {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isValided, setIsValided] = useState<boolean>(false);
  const { addAddress, addressList } = useAccounts();

  const options = useMemo(() => {
    return addressList
      .filter((item) => !blockAddressList.includes(item.address))
      .map((item) => {
        return {
          label: (
            <div className={classes.option}>
              <Identicon
                className={classes.identicon}
                size={32}
                value={item.address}
              />
              <div>
                {item?.meta?.name ? <p>{item.meta.name}</p> : null}
                <FormatAddress
                  address={item.address}
                  withFullAddress
                />
              </div>
            </div>
          ),
          value: item.address
        };
      });
  }, [addressList, blockAddressList]);

  const insertOptions = useCallback((value: string) => {
    addAddress(value);
  }, [addAddress]);

  const handleError = useCallback((error: boolean): void => {
    if (!error) {
      onError(false);
      setError('');
    } else {
      onError(true);
      setError('Not an validate address');
    }
  }, [setError, onError]);

  const _setValue = useCallback((value: string): void => {
    setValue(value);
    insertOptions(value);

    if (isValidateAddress(value)) {
      onChange(value);
      handleError(false);
      setIsValided(true);
    } else {
      onChange('');
      handleError(true);
      setIsValided(false);
    }
  }, [setValue, handleError, setIsValided, insertOptions, onChange]);

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
