import React, { useContext, FC, useCallback, useMemo, useEffect, useState } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { convertToFixed18, Fixed18, calcCanGenerate } from '@acala-network/app-util';

import { BalanceInput, UserBalance, FormatBalance, getTokenName } from '@acala-dapp/react-components';
import { useFormValidator, useConstants, useBalance, useLoanHelper } from '@acala-dapp/react-hooks';
import { Button } from '@acala-dapp/ui-components';

import { createProviderContext } from './CreateProvider';
import classes from './Generate.module.scss';
import { LoanContext } from './LoanProvider';

export const Generate: FC = () => {
  const {
    selectedToken,
    setDeposit,
    setGenerate,
    setStep
  } = useContext(createProviderContext);
  const { cancelCurrentTab } = useContext(LoanContext);
  const { minmumDebitValue, stableCurrency } = useConstants();
  const selectedCurrencyBalance = useBalance(selectedToken);
  const helper = useLoanHelper(selectedToken);
  const [collateralAmount, setColalteralAmount] = useState<number>(0);
  const maxGenerate = useMemo(() => {
    if (!helper) return Fixed18.ZERO;

    // calculate max generate
    return calcCanGenerate(
      helper.collaterals.add(Fixed18.fromNatural(collateralAmount || 0)).mul(helper.collateralPrice),
      helper.debitAmount,
      helper.requiredCollateralRatio,
      helper.stableCoinPrice
    );
  }, [collateralAmount, helper]);

  const validator = useFormValidator({
    deposit: {
      currency: selectedToken,
      min: 0,
      type: 'balance'
    },
    generate: {
      max: maxGenerate.toNumber(),
      min: minmumDebitValue.toNumber(),
      type: 'number'
    }
  });

  const form = useFormik({
    initialValues: {
      deposit: (('' as any) as number),
      generate: (('' as any) as number)
    },
    onSubmit: noop,
    validate: validator
  });

  const handleNext = useCallback((): void => {
    setStep('confirm');
  }, [setStep]);

  const handlePrevious = useCallback((): void => {
    setStep('select');
  }, [setStep]);

  const isDisabled = useMemo((): boolean => {
    if (!form.values.deposit || !form.values.generate) {
      return true;
    }

    if (form.errors.deposit || form.errors.generate) {
      return true;
    }

    return false;
  }, [form]);

  const handleDepositMax = useCallback((): void => {
    const data = convertToFixed18(selectedCurrencyBalance || 0).toNumber();

    form.setFieldValue('deposit', data);
  }, [selectedCurrencyBalance, form]);

  const handleDepositChange = useCallback((value: number) => {
    form.setFieldValue('deposit', value);
  }, [form]);

  const handleGenerateChange = useCallback((value: number) => {
    form.setFieldValue('generate', value);
  }, [form]);

  useEffect(() => {
    if (!helper) return;

    setDeposit(form.values.deposit);
    setGenerate(form.values.generate);
    setColalteralAmount(form.values.deposit);
  }, [helper, form, setDeposit, setGenerate]);

  if (!helper) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.console}>
          <p className={classes.title}>
            How much {getTokenName(selectedToken)} would you deposit as collateral?
          </p>
          <BalanceInput
            className={classes.input}
            error={form.errors.deposit}
            id='deposit'
            name='deposit'
            onChange={handleDepositChange}
            onMax={handleDepositMax}
            showMaxBtn
            size='middle'
            token={selectedToken}
            value={form.values.deposit}
          />
          <div className={classes.addon}>
            <UserBalance token={selectedToken} />
            <span>Max to Lock</span>
          </div>
          <p className={classes.title}>How much {getTokenName(stableCurrency)} would you like to borrow?</p>
          <BalanceInput
            className={classes.input}
            error={form.errors.generate}
            id='generate'
            name='generate'
            onChange={handleGenerateChange}
            size='middle'
            token={stableCurrency}
            value={form.values.generate}
          />
          <div className={classes.addon}>
            <FormatBalance
              balance={maxGenerate}
              currency={stableCurrency}
            />
            <span>Max to borrow</span>
          </div>
          <div className={classes.addon}>
            <FormatBalance
              balance={minmumDebitValue}
              currency={stableCurrency}
            />
            <span>Min to borrow</span>
          </div>
        </div>
      </div>
      <div className={classes.tips}>
        Note: collateralization ratio = total collateral in USD / amount borrowed must be above the required collateral ratio.
      </div>
      <div className={classes.action}>
        <Button
          onClick={cancelCurrentTab}
          size='small'
          type='ghost'
        >
          Cancel
        </Button>
        <Button
          onClick={handlePrevious}
          size='small'
          type='border'
        >
          Prev
        </Button>
        <Button
          color='primary'
          disabled={isDisabled}
          onClick={handleNext}
          size='small'
        >
          Next
        </Button>
      </div>
    </div>
  );
};
