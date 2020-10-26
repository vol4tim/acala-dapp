import React, { useContext, FC, useCallback, useMemo, useState } from 'react';

import { Fixed18, calcCanGenerate } from '@acala-network/app-util';

import { BalanceInput, UserBalance, FormatBalance, getTokenName, BalanceInputValue } from '@acala-dapp/react-components';
import { useConstants, useBalance, useLoanHelper } from '@acala-dapp/react-hooks';
import { Button } from '@acala-dapp/ui-components';

import { createProviderContext } from './CreateProvider';
import classes from './Generate.module.scss';
import { LoanContext } from './LoanProvider';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';

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
    if (!helper) return new Fixed18(1);

    // calculate max generate
    const result = calcCanGenerate(
      helper.collaterals.add(Fixed18.fromNatural(collateralAmount || 0)).mul(helper.collateralPrice),
      helper.debitAmount,
      helper.requiredCollateralRatio,
      helper.stableCoinPrice
    );

    return result.isZero() ? new Fixed18(1) : result;
  }, [collateralAmount, helper]);

  const [depositValue, setDepositValue, { ref: depositValueRef }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: selectedToken
  });

  const [generateValue, setGenerateValue] = useInputValue<BalanceInputValue>({
    amount: 1,
    token: stableCurrency
  });

  const handleNext = useCallback((): void => {
    setStep('confirm');
  }, [setStep]);

  const handlePrevious = useCallback((): void => {
    setStep('select');
  }, [setStep]);

  const isDisabled = useMemo((): boolean => {
    return !(generateValue.amount && depositValue.amount);
  }, [generateValue, depositValue]);

  const handleDepositMax = useCallback((): void => {
    setDeposit(selectedCurrencyBalance.toNumber());
    setDepositValue({
      amount: selectedCurrencyBalance.toNumber(),
      token: depositValueRef.current.token
    });
  }, [setDepositValue, selectedCurrencyBalance, depositValueRef, setDeposit]);

  const handleDepositChange = useCallback((value: BalanceInputValue) => {
    setDeposit(value.amount);
    setColalteralAmount(value.amount);

    setDepositValue({
      amount: value.amount,
      token: depositValueRef.current.token
    });
  }, [setDepositValue, setDeposit, setColalteralAmount, depositValueRef]);

  const handleGenerateChange = useCallback((value: BalanceInputValue) => {
    setGenerate(value.amount);

    setGenerateValue({
      amount: value.amount,
      token: generateValue.token
    });
  }, [setGenerateValue, setGenerate, generateValue]);

  if (!helper) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.console}>
          <p className={classes.title}>
            How much {getTokenName(selectedToken.asToken.toString())} would you deposit as collateral?
          </p>
          <BalanceInput
            className={classes.input}
            error={''}
            onChange={handleDepositChange}
            onMax={handleDepositMax}
            showMaxBtn
            size='middle'
            value={depositValue}
          />
          <div className={classes.addon}>
            <UserBalance token={selectedToken} />
            <span>Max to Lock</span>
          </div>
          <p className={classes.title}>How much {getTokenName(stableCurrency.asToken.toString())} would you like to borrow?</p>
          <BalanceInput
            checkBalance={false}
            className={classes.input}
            error={''}
            max={maxGenerate.toNumber()}
            min={minmumDebitValue.toNumber()}
            onChange={handleGenerateChange}
            size='middle'
            value={generateValue}
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
