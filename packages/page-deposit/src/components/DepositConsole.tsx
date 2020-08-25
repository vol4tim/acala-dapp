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
  onMax?: () => void;
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
  onMax,
  onTokenChange,
  showMax = true,
  token,
  value
}) => {
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
        onMax={onMax}
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
  const baseBalance = useBalance(baseCurrencyId);
  const otherBalance = useBalance(otherCurrency);

  const handleOtherInput = useCallback((_value: number | string): void => {
    const value = Number(_value);

    nextTick(() => {
      form.setValues({
        base: Fixed18.fromNatural(value).mul(rate).toNumber(),
        other: value
      });
    });
  }, [form, rate]);

  const handleBaseInput = useCallback((_value: number | string): void => {
    const value = Number(_value);

    nextTick(() => {
      form.setValues({
        base: value,
        other: Fixed18.fromNatural(value).div(rate).toNumber()
      });
    });
  }, [form, rate]);

  const handleSuccess = useCallback((): void => {
    // reset form
    form.resetForm();
  }, [form]);

  const handleOtherCurrencyChange = useCallback((currency: CurrencyId): void => {
    setOtherCurrency(currency);

    // reset form
    form.resetForm();
  }, [setOtherCurrency, form]);

  const handleMax = useCallback(() => {
    // base amount calculate from other
    const other2Base = otherBalance.mul(rate);
    const base2Other = baseBalance.div(rate);

    if (other2Base.isGreaterThan(baseBalance)) {
      form.setValues({
        base: baseBalance.toString(18, 3),
        other: base2Other.toString(18, 3)
      });
    }

    if (base2Other.isGreaterThan(otherBalance)) {
      form.setValues({
        base: other2Base.toString(18, 3),
        other: otherBalance.toString(18, 3)
      });
    }
  }, [otherBalance, baseBalance, form, rate]);

  const checkDisabled = useCallback((): boolean => {
    if (!(form.values.base && form.values.other)) {
      return true;
    }

    if (form.errors.base || form.errors.other) {
      return true;
    }

    return false;
  }, [form]);

  return (
    <Card>
      <div className={classes.main}>
        <InputArea
          currencies={enabledCurrencyIds}
          error={form.errors.other}
          id={'other'}
          name={'other'}
          onChange={handleOtherInput}
          onMax={handleMax}
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
          onMax={handleMax}
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
