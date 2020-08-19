import React, { FC, useState, useContext, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { Card, nextTick } from '@acala-dapp/ui-components';
import { useDexExchangeRate, useFormValidator, useBalance } from '@acala-dapp/react-hooks';
import { BalanceInput, TxButton, numToFixed18Inner, DexPoolRate, DexPoolSize, DexUserShare, UserBalance } from '@acala-dapp/react-components';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { CurrencyChangeFN } from '@acala-dapp/react-components/types';

import classes from './DepositConsole.module.scss';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import { DepositContext } from './Provider';

interface InputAreaProps {
  disabled?: boolean;
  error: any;
  id: string;
  name: string;
  currencies?: CurrencyLike[];
  value: number;
  onChange: (value: number | string) => void;
  token: CurrencyLike;
  onTokenChange?: CurrencyChangeFN;
  maxValue?: number;
  showMax?: boolean;
}

const InputArea: FC<InputAreaProps> = ({
  currencies,
  disabled,
  error,
  id,
  name,
  onChange,
  onTokenChange,
  showMax = true,
  token,
  value
}) => {
  const balance = useBalance(token);
  const handleMax = useCallback(() => {
    if (!onChange || !balance) return;

    onChange(balance.toNumber());
  }, [onChange, balance]);

  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Deposit</p>
        <div className={classes.inputAreaBalance}>Available: <UserBalance token={token} /></div>
      </div>
      <BalanceInput
        currencies={currencies}
        disabled={disabled}
        enableTokenSelect
        error={error}
        id={id}
        name={name}
        onChange={onChange}
        onMax={handleMax}
        onTokenChange={onTokenChange}
        showMaxBtn={showMax}
        token={token}
        value={value}
      />
    </div>
  );
};

InputArea.displayName = 'InputArea';

export const DepositConsole: FC = () => {
  const { baseCurrencyId, enabledCurrencyIds } = useContext(DepositContext);
  const [otherCurrency, setOtherCurrency] = useState<CurrencyId>(enabledCurrencyIds[0]);
  const rate = useDexExchangeRate(otherCurrency);
  const validator = useFormValidator({
    base: {
      currency: baseCurrencyId,
      min: 0,
      type: 'balance'
    },
    other: {
      currency: otherCurrency,
      min: 0,
      type: 'balance'
    }
  });
  const form = useFormik({
    initialValues: {
      base: '',
      other: ''
    },
    onSubmit: noop,
    validate: validator
  });

  const handleOtherInput = (_value: number | string): void => {
    const value = Number(_value);

    nextTick(() => {
      form.setValues({
        base: Fixed18.fromNatural(value).mul(rate).toNumber(),
        other: value
      });
    });
  };

  const handleBaseInput = (_value: number | string): void => {
    const value = Number(_value);

    nextTick(() => {
      form.setValues({
        base: value,
        other: Fixed18.fromNatural(value).div(rate).toNumber()
      });
    });
  };

  const handleSuccess = (): void => {
    // reset form
    form.resetForm();
  };

  const handleOtherCurrencyChange = (currency: CurrencyId): void => {
    setOtherCurrency(currency);

    // reset form
    form.resetForm();
  };

  const checkDisabled = (): boolean => {
    if (!(form.values.base && form.values.other)) {
      return true;
    }

    if (form.errors.base || form.errors.other) {
      return true;
    }

    return false;
  };

  return (
    <Card>
      <div className={classes.main}>
        <InputArea
          currencies={enabledCurrencyIds}
          error={form.errors.other}
          id={'other'}
          name={'other'}
          onChange={handleOtherInput}
          onTokenChange={handleOtherCurrencyChange}
          token={otherCurrency}
          value={form.values.other as number}
        />
        <AddIcon className={classes.addIcon} />
        <InputArea
          currencies={[baseCurrencyId]}
          error={form.errors.base}
          id={'base'}
          name={'base'}
          onChange={handleBaseInput}
          token={baseCurrencyId}
          value={form.values.base as number}
        />
        <TxButton
          className={classes.txBtn}
          disabled={checkDisabled()}
          method='addLiquidity'
          onExtrinsicSuccess={handleSuccess}
          params={
            [
              otherCurrency,
              numToFixed18Inner(form.values.other),
              numToFixed18Inner(form.values.base)
            ]
          }
          section='dex'
          size='large'
        >
          Deposit
        </TxButton>
      </div>
      <div>
        <ul className={classes.addon}>
          <li className={classes.addonItem}>
            <span>Exchange Rate</span>
            <DexPoolRate supply={otherCurrency} />
          </li>
          <li className={classes.addonItem}>
            <span>Current Pool Size</span>
            <DexPoolSize token={otherCurrency} />
          </li>
          <li className={classes.addonItem}>
            <span>Your Pool Share(%)</span>
            <DexUserShare token={otherCurrency} />
          </li>
        </ul>
      </div>
    </Card>
  );
};
