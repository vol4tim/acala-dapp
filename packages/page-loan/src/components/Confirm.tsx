import React, { FC, useContext, useMemo, ReactNode, useCallback } from 'react';

import { FormatBalance, FormatFixed18, TxButton, numToFixed18Inner } from '@acala-dapp/react-components';
import { createProviderContext } from './CreateProvider';
import { useConstants, useLoanHelper } from '@acala-dapp/react-hooks';
import { Fixed18, stableCoinToDebit, calcCollateralRatio } from '@acala-network/app-util';
import { List, Button } from '@acala-dapp/ui-components';
import classes from './Confirm.module.scss';
import { LoanContext } from './LoanProvider';

export const Confirm: FC = () => {
  const {
    deposit,
    generate,
    selectedToken,
    setStep
  } = useContext(createProviderContext);
  const { cancelCurrentTab } = useContext(LoanContext);
  const { stableCurrency } = useConstants();
  const helper = useLoanHelper(selectedToken);

  const data = useMemo(() => {
    if (!helper) return {};

    return {
      borrowing: generate,
      collateralRatio: calcCollateralRatio(
        helper.collaterals.add(Fixed18.fromNatural(deposit || 0)).mul(helper.collateralPrice),
        helper.debitAmount.add(Fixed18.fromNatural(generate || 0))
      ),
      depositing: deposit,
      interestRate: helper.stableFeeAPR
    };
  }, [helper, deposit, generate]);

  const listConfig = useMemo(() => {
    return [
      {
        key: 'depositing',
        /* eslint-disable-next-line react/display-name */
        render: (data: number): ReactNode => {
          return (
            <FormatBalance
              balance={data}
              currency={selectedToken}
            />
          );
        },
        title: 'Depositing'
      },
      {
        key: 'borrowing',
        /* eslint-disable-next-line react/display-name */
        render: (data: number): ReactNode => {
          return (
            <FormatBalance
              balance={data}
              currency={stableCurrency}
            />
          );
        },
        title: 'Borrowing'
      },
      {
        key: 'collateralRatio',
        /* eslint-disable-next-line react/display-name */
        render: (data: Fixed18): JSX.Element => {
          return (
            <FormatFixed18
              data={data}
              format='percentage'
            />
          );
        },
        title: 'Collateralization Ratio'
      },
      {
        key: 'interestRate',
        /* eslint-disable-next-line react/display-name */
        render: (data: Fixed18): JSX.Element => {
          return (
            <FormatFixed18
              data={data}
              format='percentage'
            />
          );
        },
        title: 'Interest Rate'
      }
    ];
  }, [selectedToken, stableCurrency]);

  const isDisabled = useMemo((): boolean => {
    return false;
  }, []);

  const params = useMemo<string[]>((): string[] => {
    if (!helper) return [];

    return [
      // token name
      selectedToken.toString(),
      // collateral amount
      numToFixed18Inner(deposit),
      // debit amount
      stableCoinToDebit(
        Fixed18.fromNatural(generate),
        helper.debitExchangeRate
      ).innerToString()
    ];
  }, [helper, selectedToken, deposit, generate]);

  const handleSuccess = useCallback((): void => {
    setStep('success');
  }, [setStep]);

  const handlePrevious = useCallback((): void => {
    setStep('generate');
  }, [setStep]);

  if (!helper) {
    return null;
  }

  return (
    <div className={classes.root}>
      <List
        config={listConfig}
        data={data}
        itemClassName={classes.listItem}
      />
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
        <TxButton
          disabled={isDisabled}
          method='adjustLoan'
          onSuccess={handleSuccess}
          params={params}
          section='honzon'
          size='small'
        >
          Confirm
        </TxButton>
      </div>
    </div>
  );
};
