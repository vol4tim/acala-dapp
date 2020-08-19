import React, { FC, useContext, ReactElement, ReactNode, useCallback, useMemo } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';

import { Card, nextTick, IconButton, Condition } from '@acala-dapp/ui-components';
import { BalanceInput, TxButton, numToFixed18Inner, DexExchangeRate, FormatBalance } from '@acala-dapp/react-components';
import { useFormValidator, useBalance } from '@acala-dapp/react-hooks';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { CurrencyChangeFN } from '@acala-dapp/react-components/types';

import classes from './SwapConsole.module.scss';
import { SwapInfo } from './SwapInfo';
import { SlippageInputArea } from './SlippageInputArea';
import { SwapContext } from './SwapProvider';

interface InputAreaProps {
  addon?: ReactNode;
  error: any;
  title: string;
  disabledCurrencies?: (CurrencyId | string)[];
  currencies: (CurrencyId | string)[];
  token: CurrencyLike;
  onTokenChange: CurrencyChangeFN;
  value: number;
  onChange: (value: number) => void;
  inputName: string;
  showMax?: boolean;
  maxInput?: Fixed18;
}

const InputArea: FC<InputAreaProps> = ({
  addon,
  currencies,
  disabledCurrencies,
  error,
  inputName,
  maxInput,
  onChange,
  onTokenChange,
  showMax = false,
  title,
  token,
  value
}) => {
  const handleMax = useCallback(() => {
    if (!onChange || !maxInput) return;

    onChange(maxInput.toNumber());
  }, [maxInput, onChange]);

  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.title}>
        {title}

        <Condition condition={!!maxInput}>
          <p>
            Max:
            <FormatBalance
              balance={maxInput as Fixed18}
              currency={token}
            />
          </p>
        </Condition>
      </div>
      <BalanceInput
        className={classes.input}
        currencies={currencies}
        disabledCurrencies={disabledCurrencies}
        enableTokenSelect
        error={error}
        name={inputName}
        onChange={onChange}
        onMax={handleMax}
        onTokenChange={onTokenChange}
        showMaxBtn={showMax}
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

export const SwapConsole: FC = () => {
  const {
    calcSupply,
    calcTarget,
    pool,
    priceImpact,
    setCurrency,
    slippage,
    supplyCurrencies,
    targetCurrencies
  } = useContext(SwapContext);
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

  const onSupplyChange = useCallback((value: number): void => {
    calcTarget(pool.supplyCurrency, pool.targetCurrency, value).subscribe((target) => {
      nextTick(() => form.setFieldValue('target', target));
    });

    nextTick(() => form.setFieldValue('supply', value));
  }, [calcTarget, pool.supplyCurrency, pool.targetCurrency, form]);

  const onTargetChange = useCallback((value: number): void => {
    calcSupply(pool.supplyCurrency, pool.targetCurrency, value).subscribe((supply) => {
      nextTick(() => form.setFieldValue('supply', supply));
    });

    nextTick(() => form.setFieldValue('target', value));
  }, [calcSupply, pool.supplyCurrency, pool.targetCurrency, form]);

  const onSupplyTokenChange = useCallback((token: CurrencyId): void => {
    setCurrency(token, pool.targetCurrency);

    calcSupply(token, pool.targetCurrency, form.values.target).subscribe((supply) => {
      if (supply) nextTick(() => form.setFieldValue('supply', supply));
    });
  }, [calcSupply, form, pool.targetCurrency, setCurrency]);

  const onTargetTokenChange = useCallback((token: CurrencyId): void => {
    setCurrency(pool.supplyCurrency, token);

    calcTarget(pool.supplyCurrency, token, form.values.supply).subscribe((target) => {
      if (target) nextTick(() => form.setFieldValue('target', target));
    });
  }, [calcTarget, form, pool.supplyCurrency, setCurrency]);

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

  const params = useMemo(() => {
    return [
      pool.supplyCurrency,
      numToFixed18Inner(form.values.supply),
      pool.targetCurrency,
      Fixed18.fromNatural(form.values.target).div(Fixed18.fromNatural(1 + slippage)).innerToString()
    ];
  }, [form, pool, slippage]);

  return (
    <Card className={classes.root}
      padding={false}>
      <div className={classes.main}>
        <div className={classes.inputFields}>
          <div className={classes.inputFieldsInner}>
            <InputArea
              currencies={supplyCurrencies}
              disabledCurrencies={[pool.targetCurrency]}
              error={form.errors.supply}
              inputName='supply'
              maxInput={maxSupplyInput}
              onChange={onSupplyChange}
              onTokenChange={onSupplyTokenChange}
              showMax={true}
              title='Pay With'
              token={pool.supplyCurrency}
              value={form.values.supply as number}
            />
            <SwapBtn onClick={onSwap} />
            <InputArea
              currencies={targetCurrencies}
              disabledCurrencies={[pool.supplyCurrency]}
              error={form.errors.target}
              inputName='target'
              onChange={onTargetChange}
              onTokenChange={onTargetTokenChange}
              title='Receive (Estimate)'
              token={pool.targetCurrency}
              value={form.values.target}
            />
          </div>
          <div className={classes.addon}>
            <p>Price:</p>
            <DexExchangeRate
              supply={pool.supplyCurrency}
              supplyAmount={form.values.supply as number}
              target={pool.targetCurrency}
            />
          </div>
        </div>
        <TxButton
          className={classes.txBtn}
          color={priceImpact > 0.05 ? 'danger' : 'primary'}
          disabled={isDisabled}
          method='swapCurrency'
          onExtrinsicSuccess={form.resetForm}
          params={params}
          section='dex'
          size='large'
        >
          {priceImpact > 0.05 ? 'Swap Anyway' : 'Swap'}
        </TxButton>
      </div>
      <SwapInfo
        supply={form.values.supply}
        supplyCurrency={pool.supplyCurrency}
        target={form.values.target}
        targetCurrency={pool.targetCurrency}
      />
      <SlippageInputArea />
    </Card>
  );
};
