import React, { FC, memo, useMemo } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';

import { useFormValidator, useConstants, useRefundCollateral, RefundCollaterals, useBalance } from '@acala-dapp/react-hooks';
import { BalanceInput, TxButton, numToFixed18Inner, UserBalance, FormatBalance, BalancePair } from '@acala-dapp/react-components';

import classes from './RefundCollateral.module.scss';
import { ReactComponent as AddIcon } from '../assets/add.svg';

interface InputAreaProps {
  disabled?: boolean;
  error: any;
  onMax: () => void;
  id: string;
  name: string;
  currencies?: (CurrencyId | string)[];
  value: number;
  onChange: (event: React.ChangeEvent<any>) => void;
  token: CurrencyId;
  onTokenChange?: (token: CurrencyId) => void;
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
  token,
  value
}) => {
  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Input</p>
        <div className={classes.inputAreaBalance}>Balance: <UserBalance token={token} /></div>
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
        showMaxBtn
        token={token}
        value={value}
      />
    </div>
  );
};

const Output: FC<{ collatearls?: RefundCollaterals}> = ({ collatearls }) => {
  const _data = useMemo<BalancePair[]>(() => {
    if (!collatearls) {
      return [];
    }

    const _result: BalancePair[] = [];

    Object.keys(collatearls).forEach((currency: string) => {
      _result.push({ balance: collatearls[currency], currency });
    });

    return _result;
  }, [collatearls]);

  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Output</p>
      </div>
      <FormatBalance
        className={classes.output}
        pair={_data}
        pairSymbol='+'
      />
    </div>
  );
};

export const RefundCollateral: FC = memo(() => {
  const { stableCurrency } = useConstants();
  const { calcCanReceive } = useRefundCollateral();
  const stableCoinBalance = useBalance(stableCurrency);
  const validator = useFormValidator({
    stableCoin: {
      currency: stableCurrency,
      type: 'balance'
    }
  });
  const form = useFormik({
    initialValues: {
      stableCoin: ''
    },
    onSubmit: noop,
    validate: validator
  });

  const handleOtherInput = (event: React.ChangeEvent<any>): void => {
    form.handleChange(event);
  };

  const handleMax = (): void => {
    if (stableCoinBalance) {
      form.setValues({ stableCoin: convertToFixed18(stableCoinBalance).toNumber() });
    }
  };

  const handleSuccess = (): void => {
    // reset form
    form.resetForm();
  };

  return (
    <div className={classes.main}>
      <InputArea
        currencies={[stableCurrency]}
        error={form.errors.stableCoin}
        id={'stableCoin'}
        name={'stableCoin'}
        onChange={handleOtherInput}
        onMax={handleMax}
        token={stableCurrency}
        value={form.values.stableCoin as number}
      />
      <AddIcon className={classes.addIcon} />
      <Output collatearls={calcCanReceive(Fixed18.fromNatural(form.values.stableCoin))} />
      <TxButton
        className={classes.txBtn}
        method='refundCollaterals'
        onSuccess={handleSuccess}
        params={
          [
            numToFixed18Inner(form.values.stableCoin)
          ]
        }
        section='emergencyShutdown'
        size='large'
      >
        Refund
      </TxButton>
    </div>
  );
});
