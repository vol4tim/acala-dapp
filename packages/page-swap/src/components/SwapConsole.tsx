import React, { FC, memo, useContext, ReactElement, ChangeEvent, ReactNode, useState, useCallback, useMemo } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';

import { Card, nextTick, IconButton, Condition } from '@acala-dapp/ui-components';
import { BalanceInput, TxButton, numToFixed18Inner, DexExchangeRate, FormatFixed18, TokenName } from '@acala-dapp/react-components';
import { useFormValidator, useBalance } from '@acala-dapp/react-hooks';

import classes from './SwapConsole.module.scss';
import { SwapInfo } from './SwapInfo';
import { SlippageInputArea } from './SlippageInputArea';
import { SwapContext } from './SwapProvider';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';

interface InputAreaProps {
  addon?: ReactNode;
  error: any;
  title: string;
  currencies: (CurrencyId | string)[];
  token: CurrencyId | string;
  onTokenChange: (token: CurrencyId) => void;
  value: number;
  onChange: any;
  inputName: string;
  showBalance?: boolean;
  maxInput?: Fixed18;
}

const InputArea: FC<InputAreaProps> = ({
  addon,
  currencies,
  error,
  inputName,
  maxInput,
  onChange,
  onTokenChange,
  title,
  token,
  value
}) => {
  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.title}>
        {title}

        <Condition condition={!!maxInput}>
          <p>
            Max: <FormatFixed18 data={maxInput} /> <TokenName currency={token} />
          </p>
        </Condition>
      </div>
      <BalanceInput
        className={classes.input}
        currencies={currencies}
        enableTokenSelect
        error={error}
        name={inputName}
        onChange={onChange}
        onTokenChange={onTokenChange}
        token={token}
        value={value}
      />
      {addon}
    </div>
  );
};

interface SwapBtn {
  onClick: () => void;
}

function SwapBtn ({ onClick }: SwapBtn): ReactElement {
  return (
    <IconButton
      className={classes.swapBtn}
      color='primary'
      icon='swap'
      onClick={onClick}
      size='large'
      type='border'
    />
  );
}

export const SwapConsole: FC = memo(() => {
  const {
    calcSupply,
    calcTarget,
    pool,
    setCurrency,
    supplyCurrencies,
    targetCurrencies
  } = useContext(SwapContext);
  const [slippage, setSlippage] = useState<number>(0.005);
  const supplyCurrencyBalance = useBalance(pool.supplyCurrency);

  const validator = useFormValidator({
    supply: {
      currency: pool.supplyCurrency,
      max: pool.supplySize,
      min: 0,
      type: 'balance'
    },
    target: {
      max: pool.targetSize,
      min: 0,
      type: 'number'
    }
  });

  const form = useFormik({
    initialValues: {
      supply: (('' as any) as number),
      target: (('' as any) as number)
    },
    onSubmit: noop,
    validate: validator
  });

  const onSwap = useCallback((): void => {
    setCurrency(pool.targetCurrency, pool.supplyCurrency);
    form.resetForm();
  }, [setCurrency, pool.targetCurrency, pool.supplyCurrency, form]);

  const onSupplyChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.currentTarget.value);

    calcTarget(pool.supplyCurrency, pool.targetCurrency, value, slippage).subscribe((target) => {
      nextTick(() => form.setFieldValue('target', target));
    });

    form.handleChange(event);
  };

  const onTargetChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.currentTarget.value);

    calcSupply(pool.supplyCurrency, pool.targetCurrency, value, slippage).subscribe((supply) => {
      nextTick(() => form.setFieldValue('supply', supply));
    });

    form.handleChange(event);
  };

  const onSlippageChange = (slippage: number): void => {
    const supply = form.values.supply;

    setSlippage(slippage);
    calcTarget(pool.supplyCurrency, pool.targetCurrency, supply, slippage).subscribe((target) => {
      nextTick(() => form.setFieldValue('target', target));
    });
  };

  const onSupplyTokenChange = (token: CurrencyId): void => {
    setCurrency(token, pool.targetCurrency);

    calcSupply(token, pool.targetCurrency, form.values.target, slippage).subscribe((supply) => {
      if (supply) nextTick(() => form.setFieldValue('supply', supply));
    });
  };

  const onTargetTokenChange = (token: CurrencyId): void => {
    setCurrency(pool.supplyCurrency, token);

    calcTarget(pool.supplyCurrency, token, form.values.supply, slippage).subscribe((target) => {
      if (target) nextTick(() => form.setFieldValue('target', target));
    });
  };

  const isDisabled = useMemo((): boolean => {
    if (form.errors.supply || form.errors.target) {
      return true;
    }

    if (!(form.values.target && form.values.supply)) {
      return true;
    }

    return false;
  }, [form]);

  const maxSupplyInput = useMemo<Fixed18 | undefined>(() => {
    return supplyCurrencyBalance ? convertToFixed18(supplyCurrencyBalance).min(Fixed18.fromNatural(pool.supplySize)) : undefined;
  }, [supplyCurrencyBalance, pool.supplySize]);

  return (
    <Card className={classes.root}
      padding={false}>
      <div className={classes.main}>
        <InputArea
          currencies={supplyCurrencies}
          error={form.errors.supply}
          inputName='supply'
          maxInput={maxSupplyInput}
          onChange={onSupplyChange}
          onTokenChange={onSupplyTokenChange}
          title='Pay With'
          token={pool.supplyCurrency}
          value={form.values.supply as number}
        />
        <SwapBtn onClick={onSwap} />
        <InputArea
          addon={
            <div className={classes.addon}>
              <p>Exchange Rate</p>
              <DexExchangeRate
                supply={pool.supplyCurrency}
                target={pool.targetCurrency}
              />
            </div>
          }
          currencies={targetCurrencies}
          error={form.errors.target}
          inputName='target'
          onChange={onTargetChange}
          onTokenChange={onTargetTokenChange}
          title='Receive'
          token={pool.targetCurrency}
          value={form.values.target}
        />
        <TxButton
          className={classes.txBtn}
          disabled={isDisabled}
          method='swapCurrency'
          onSuccess={form.resetForm}
          params={
            [
              pool.supplyCurrency,
              numToFixed18Inner(form.values.supply),
              pool.targetCurrency,
              numToFixed18Inner(form.values.target)
            ]
          }
          section='dex'
          size='large'
        >
          Swap
        </TxButton>
      </div>
      <SwapInfo
        slippage={slippage}
        supply={form.values.supply}
        supplyCurrency={pool.supplyCurrency}
        target={form.values.target}
        targetCurrency={pool.targetCurrency}
      />
      <SlippageInputArea
        onChange={onSlippageChange}
        slippage={slippage}
      />
    </Card>
  );
});

SwapConsole.displayName = 'SwapConsole';
