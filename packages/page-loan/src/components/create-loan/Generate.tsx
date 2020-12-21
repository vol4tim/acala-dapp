import React, { useContext, FC, useCallback, useMemo, useState } from 'react';

import { Fixed18, calcCanGenerate } from '@acala-network/app-util';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { BalanceInput, UserBalance, FormatBalance, getTokenName, BalanceInputValue, focusToFixedPointNumber } from '@acala-dapp/react-components';
import { useConstants, useBalance, useLoanHelper, useBalanceValidator } from '@acala-dapp/react-hooks';
import { Button } from '@acala-dapp/ui-components';

import { createProviderContext } from './CreateProvider';
import classes from './Generate.module.scss';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';

export const Generate: FC = () => {
  const {
    cancelCreate,
    selectedToken,
    setDeposit,
    setGenerate,
    setStep
  } = useContext(createProviderContext);
  const { minmumDebitValue, stableCurrency } = useConstants();
  const selectedCurrencyBalance = useBalance(selectedToken);
  const helper = useLoanHelper(selectedToken);
  const [collateralAmount, setColalteralAmount] = useState<number>(0);
  const maxGenerate = useMemo(() => {
    if (!helper) return FixedPointNumber.ZERO;

    // calculate max generate
    return focusToFixedPointNumber(calcCanGenerate(
      helper.collaterals.add(Fixed18.fromNatural(collateralAmount || 0)).mul(helper.collateralPrice),
      helper.debitAmount,
      helper.requiredCollateralRatio,
      helper.stableCoinPrice
    ));
  }, [collateralAmount, helper]);

  const [depositValue, setDepositValue, {
    error: depositError,
    setValidator: setDepositValidator
  }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: selectedToken
  });

  const [generateValue, setGenerateValue, {
    error: generateError,
    setValidator: setGenerateValidator
  }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: stableCurrency
  });

  useBalanceValidator({
    currency: selectedToken,
    updateValidator: setDepositValidator
  });

  useBalanceValidator({
    checkBalance: false,
    currency: stableCurrency,
    max: [maxGenerate, ''],
    min: [FixedPointNumber.ONE, 'Generate must larger than minimum debit (1aUSD)'],
    updateValidator: setGenerateValidator
  });

  const handleNext = useCallback((): void => {
    setStep('confirm');
  }, [setStep]);

  const handlePrevious = useCallback((): void => {
    setStep('select');
  }, [setStep]);

  const isDisabled = useMemo((): boolean => {
    if (depositError) return true;

    if (generateError) return true;

    return !(generateValue.amount && depositValue.amount);
  }, [generateValue, depositValue, depositError, generateError]);

  const handleDepositMax = useCallback((): void => {
    setDeposit(selectedCurrencyBalance.toNumber());
    setColalteralAmount(selectedCurrencyBalance.toNumber());
    setDepositValue({ amount: selectedCurrencyBalance.toNumber() });
  }, [setDepositValue, selectedCurrencyBalance, setDeposit]);

  const handleDepositChange = useCallback(({ amount }: Partial<BalanceInputValue>) => {
    setDeposit(amount || 0);
    setColalteralAmount(amount || 0);

    setDepositValue({ amount });
  }, [setDepositValue, setDeposit, setColalteralAmount]);

  const handleGenerateChange = useCallback(({ amount }: Partial<BalanceInputValue>) => {
    setGenerate(amount || 0);

    setGenerateValue({ amount });
  }, [setGenerateValue, setGenerate]);

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
            error={depositError}
            onChange={handleDepositChange}
            onMax={handleDepositMax}
            size='middle'
            value={depositValue}
          />
          <div className={classes.addon}>
            <UserBalance currency={selectedToken} />
            <span>Max to Lock</span>
          </div>
          <p className={classes.title}>How much {getTokenName(stableCurrency.asToken.toString())} would you like to borrow?</p>
          <BalanceInput
            className={classes.input}
            error={generateError}
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
          onClick={cancelCreate}
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
