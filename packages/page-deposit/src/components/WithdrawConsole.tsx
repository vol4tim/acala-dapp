import React, { FC, memo, useState, useContext, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { Vec } from '@polkadot/types';
import { Card } from '@acala-dapp/ui-components';
import { CurrencyId, Share } from '@acala-network/types/interfaces';
import { BalanceInput, TxButton, numToFixed18Inner, DexExchangeRate, DexPoolSize, DexUserShare, BalanceInputProps } from '@acala-dapp/react-components';
import { useFormValidator, useDexShare } from '@acala-dapp/react-hooks';
import { convertToFixed18 } from '@acala-network/app-util';

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
  onChange: (eventOrPath: string | React.ChangeEvent<any>) => void;
  token: CurrencyId;
  share: Share | undefined;
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
  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Pool Shares</p>
        <p className={classes.inputAreaBalance}>
          Available: {share ? convertToFixed18(share).toString() : ''}
        </p>
      </div>
      <BalanceInput
        currencies={currencies}
        enableTokenSelect
        error={error}
        id={id}
        name={name}
        onChange={onChange}
        onTokenChange={onTokenChange}
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

  const handleOtherCurrencyChange = (currency: CurrencyId): void => {
    setOtherCurrency(currency);

    // reset form
    form.resetForm();
  };

  return (
    <Card>
      <div className={classes.main}>
        <InputArea
          currencies={enabledCurrencyIds}
          error={form.errors.share}
          id='share'
          name='share'
          onChange={form.handleChange}
          onTokenChange={handleOtherCurrencyChange}
          share={share}
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
            <span>Exchange Rate</span>
            <DexExchangeRate supply={otherCurrency} />
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
});

WithdrawConsole.displayName = 'WithdrawConsole';
