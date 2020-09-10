import React, { FC, memo, useState, useContext, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { Vec } from '@polkadot/types';
import { Card } from '@acala-dapp/ui-components';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BalanceInput, TxButton, numToFixed18Inner, DexPoolSize, DexUserShare, BalanceInputProps } from '@acala-dapp/react-components';
import { useFormValidator, useDexShare } from '@acala-dapp/react-hooks';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';

import { DepositContext } from './Provider';
import { ReactComponent as RightArrowIcon } from '../assets/right-arrow.svg';
import classes from './Withdraw.module.scss';
import { AccountDexTokens } from './AccountDexTokens';
import { useDexWithdrawShare } from './useDexWithdrawShare';

interface InputAreaProps {
  error?: BalanceInputProps['error'];
  id: string;
  name: string;
  currencies?: Vec<CurrencyId>;
  value: number;
  onChange: (value: number) => void;
  token: CurrencyId;
  share: Fixed18;
  onTokenChange?: (token: CurrencyId) => void;
}

const InputArea: FC<InputAreaProps> = memo(({
  currencies,
  error,
  id,
  name,
  onChange,
  onTokenChange,
  share,
  token,
  value
}) => {
  const handleMax = useCallback(() => {
    if (!onChange || !share) return;

    onChange(share.toNumber());
  }, [onChange, share]);

  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Pool Shares</p>
        <p className={classes.inputAreaBalance}>
          Available: {share.toNumber()}
        </p>
      </div>
      <BalanceInput
        currencies={currencies}
        enableTokenSelect
        error={error}
        id={id}
        name={name}
        onChange={onChange}
        onMax={handleMax}
        onTokenChange={onTokenChange}
        showMaxBtn
        token={token}
        value={value}
      />
    </div>
  );
});

InputArea.displayName = 'InputArea';

export const WithdrawConsole: FC = memo(() => {
  const { enabledCurrencyIds } = useContext(DepositContext);
  const [otherCurrency, setOtherCurrency] = useState<CurrencyId>(enabledCurrencyIds[0]);
  const { share } = useDexShare(otherCurrency);
  const validator = useFormValidator({
    share: {
      max: share ? convertToFixed18(share).toNumber() : 0,
      min: 0,
      type: 'number'
    }
  });
  const form = useFormik({
    initialValues: {
      share: (('' as any) as number)
    },
    onSubmit: noop,
    validate: validator
  });

  const withdrawTokens = useDexWithdrawShare(otherCurrency, form.values.share);
  const _withdrawToken = withdrawTokens.map((item) => ({ balance: item.balance.toNumber(), currency: item.currency.toString() }));

  const checkDisabled = (): boolean => {
    if (form.values.share && !form.errors.share) {
      return false;
    }

    return true;
  };

  const handleSuccess = useCallback((): void => {
    form.resetForm();
  }, [form]);

  const handleTokenChange = (currency: CurrencyId): void => {
    setOtherCurrency(currency);

    // reset form
    form.resetForm();
  };

  const handleShareChange = (value: number): void => {
    form.setFieldValue('share', value);
  };

  return (
    <Card>
      <div className={classes.main}>
        <InputArea
          currencies={enabledCurrencyIds}
          error={form.errors.share}
          id='share'
          name='share'
          onChange={handleShareChange}
          onTokenChange={handleTokenChange}
          share={share ? convertToFixed18(share) : Fixed18.ZERO}
          token={otherCurrency}
          value={form.values.share}
        />
        <RightArrowIcon className={classes.arrowIcon} />
        <div className={classes.output}>
          <div className={classes.outputTitle}>
            <p>Output: Liquidity + Reward</p>
          </div>
          <div className={classes.outputContent}>
            {
              form.values.share ? (
                <AccountDexTokens
                  token={otherCurrency}
                  withdraw={form.values.share}
                />) : null
            }
          </div>
        </div>
        <TxButton
          addon={_withdrawToken}
          className={classes.txBtn}
          disabled={checkDisabled()}
          method='withdrawLiquidity'
          onSuccess={handleSuccess}
          params={[otherCurrency, numToFixed18Inner(form.values.share)]}
          section='dex'
          size='large'
        >
          Withdraw
        </TxButton>
      </div>
      <div>
        <ul className={classes.addon}>
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
});

WithdrawConsole.displayName = 'WithdrawConsole';
