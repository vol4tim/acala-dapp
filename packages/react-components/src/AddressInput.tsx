import React, { FC, useState, ChangeEventHandler, useCallback, useContext } from 'react';
import { AccountLike } from '@acala-dapp/react-hooks/types';
import { AutoComplete, Input, InputProps } from '@acala-dapp/ui-components';
import Identicon from '@polkadot/react-identicon';
import classes from './AddressInput.module.scss';
import { isValidateAddress } from './utils';
import { FormatAddress } from './format';
import { globalStoreContext } from '@acala-dapp/react-environment';

interface AddressInputProps extends Omit<InputProps, 'onError'>{
  onAddressChange: (address: string) => void;
  onError: (error: boolean) => void;
}

/**
 * @name AddressInput
 * @description input and auto select account
 */
export const AddressInput: FC<AddressInputProps> = ({
  onAddressChange,
  onError,
  ...other
}) => {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showIdentIcon, setShowIdentIcon] = useState<boolean>(false);
  const { addAddress, addressList } = useContext(globalStoreContext);

  const renderOptions = (address: AccountLike): JSX.Element => {
    return (
      <>
        <Identicon
          className={classes.identicon}
          size={32}
          value={address}
        />
        <FormatAddress
          address={address.toString()}
        />
      </>
    );
  };

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

  const handleShowIdentIcon = useCallback((show: boolean): void => {
    setShowIdentIcon(show);
  }, [setShowIdentIcon]);

  const _setValue = useCallback((value: string): void => {
    setValue(value);
    insertOptions(value);

    if (isValidateAddress(value)) {
      onAddressChange(value);
      handleError(false);
      handleShowIdentIcon(true);
    } else {
      onAddressChange('');
      handleError(true);
      handleShowIdentIcon(false);
    }
  }, [setValue, handleError, handleShowIdentIcon, insertOptions, onAddressChange]);

  const handleInput: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const value = event.target.value;

    _setValue(value);
  }, [_setValue]);

  const handleSelect = useCallback((value: string): void => {
    _setValue(value);
  }, [_setValue]);

  const renderInput = (): JSX.Element => {
    return (
      <Input
        error={error}
        inputClassName={classes.input}
        onChange={handleInput}
        prefix={showIdentIcon ? (
          <Identicon
            className={classes.icon}
            size={32}
            value={value}
          />
        ) : undefined}
        value={value}
        {...other}
      />
    );
  };

  return (
    <AutoComplete
      onSelect={handleSelect}
      optionClassName={classes.option}
      options={addressList}
      renderInput={renderInput}
      renderOptions={renderOptions}
      value={value}
    />
  );
};
