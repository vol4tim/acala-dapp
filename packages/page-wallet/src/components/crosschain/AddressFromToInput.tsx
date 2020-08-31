import React, { FC } from 'react';
import { noop } from 'lodash';
import { AddressInput } from '@acala-dapp/react-components/AddressInput';

import classes from './AddressFromToInput.module.scss';
import { FormatAddress } from '@acala-dapp/react-components/';

export interface AddressFromToInputProps {
  from?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const AddressFromToInput: FC<AddressFromToInputProps> = ({
  from,
  onChange,
  value
}) => {
  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <p>From Account</p>
        <FormatAddress address={from}/>
      </div>
      <div className={classes.item}>
        <p>To Account</p>
        <AddressInput
          border={false}
          inputClassName={classes.addressInput}
          onChange={onChange || noop}
          onError={(): void => {}}
          showIdentIcon={false}
          value={value}
          width={320}
        />
      </div>
    </div>
  );
};
