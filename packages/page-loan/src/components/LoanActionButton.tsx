import React, { FC, useEffect, useState, ChangeEvent } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { stableCoinToDebit, Fixed18, LoanHelper } from '@acala-network/app-util';

import { Dialog, ButtonProps, Button, List, ListConfig } from '@honzon-platform/ui-components';
import { useModal, useFormValidator, useLoan, useConstants } from '@honzon-platform/react-hooks';
import { BalanceInput, TxButton, FormatBalance, FormatFixed18 } from '@honzon-platform/react-components';

import classes from './LoanActionButton.module.scss';

type ActionType = 'payback' | 'generate' | 'deposit' | 'withdraw';

interface Props extends Omit<ButtonProps, 'onClick' | 'type'> {
  type: ActionType;
  text: string;
  token: CurrencyId | string;
  max: number;
}

export const LonaActionButton: FC<Props> = ({
  max,
  text,
  token,
  type,
  ...other
}) => {
  const { close, open, status } = useModal(false);
  const { stableCurrency } = useConstants();
  const validator = useFormValidator({
    value: {
      type: 'number',
      max: max,
      min: 0
    }
  });
  const form = useFormik({
    initialValues: {
      value: '' as any as number
    },
    validate: validator,
    onSubmit: noop
  });
  const { getUserLoanHelper, currentUserLoanHelper, currentLoanType, currentUserLoan, minmumDebitValue } = useLoan(token);
  const [collateral, setCollateral] = useState<number>(0);
  const [debit, setDebit] = useState<number>(0);
  const [loanHelper, setLoanHelper] = useState<LoanHelper | null>();

  useEffect(() => {
    const _result = getUserLoanHelper(currentUserLoan, currentLoanType, collateral, debit);
    setLoanHelper(_result);
  }, [currentLoanType, currentUserLoan, collateral, debit, setLoanHelper]);

  const checkOperateStableCurrency = (): boolean => {
    return type === 'payback' || type === 'generate';
  };

  const getDialogTitle = () => {
    const _token = checkOperateStableCurrency() ? stableCurrency : token;

    return `${text} ${_token}`;
  };

  const handleClick = (): void => {
    open();
  };

  const getParams = () => {
    const params = [token, '0', '0'];

    if (!form.values.value || !loanHelper || !currentUserLoan || !currentUserLoanHelper) {
      return params;
    }

    switch (type) {
      case 'payback': {
        if (
          Fixed18.fromNatural(form.values.value)
            .sub(currentUserLoanHelper.debitAmount)
            .negated()
            .isLessThan(minmumDebitValue)
        ) {
          params[2] = currentUserLoanHelper.debits.negated().innerToString();
        } else {
          params[2] = stableCoinToDebit(
            Fixed18.fromNatural(form.values.value),
            loanHelper.debitExchangeRate
          ).negated().innerToString();
        }
        break;
      }

      case 'generate': {
        params[2] = stableCoinToDebit(
          Fixed18.fromNatural(form.values.value),
          loanHelper.debitExchangeRate
        ).innerToString();
        break;
      }

      case 'deposit': {
        params[1] = Fixed18.fromNatural(form.values.value).innerToString();
        break;
      }

      case 'withdraw': {
        if (
          currentUserLoanHelper.collaterals
          .sub(Fixed18.fromNatural(form.values.value))
          .isLessThan(Fixed18.fromNatural(0.0000001))
        ) {
          params[1] = currentUserLoanHelper.collaterals.negated().innerToString();
        } else {
          params[1] = Fixed18.fromNatural(form.values.value).negated().innerToString();
        }
        break;
      }
    }

    return params;
  };

  const checkDisabled = (): boolean => {
    if (!form.values.value) {
      return true;
    }

    if (form.errors.value) {
      return true;
    }

    return false;
  };

  const config: ListConfig[] = [
    {
      key: 'borrowed',
      title: 'Borrowed aUSD',
      render: (value) => {
        return <FormatBalance balance={value} />;
      }
    },
    {
      key: 'collateralRate',
      title: 'New Collateral Ratio',
      render: (value) => {
        return (
          <FormatFixed18
            data={value}
            format='percentage'
          />
        );
      }
    },
    {
      key: 'liquidationPrice',
      title: 'New Liquidation Price',
      render: (value) => {
        return (
          <FormatFixed18
            data={value}
            prefix='$'
          />
        );
      }
    }
  ];

  useEffect(() => {
    const value = form.values.value;

    if (value) {
      switch (type) {
        case 'deposit': {
          setCollateral(value);
          break;
        }

        case 'withdraw': {
          setCollateral(-value);
          break;
        }

        case 'generate': {
          setDebit(value);
          break;
        }

        case 'payback': {
          setDebit(-value);
          break;
        }
      }
    }
  }, [form.values.value, type, setCollateral, setDebit]);

  const _close = () => {
    setCollateral(0);
    setDebit(0);
    form.resetForm();
    close();
  };

  const getValueWithCheckFormError = (value: any): any => {
    if (form?.errors?.value) {

      return Fixed18.fromNatural(NaN);
    }

    return value || Fixed18.fromNatural(NaN);
  };

  const listData = {
    borrowed: getValueWithCheckFormError(loanHelper?.debitAmount),
    collateralRate: getValueWithCheckFormError(loanHelper?.collateralRatio),
    liquidationPrice: getValueWithCheckFormError(loanHelper?.liquidationPrice)
  };

  const handleMax = () => {
    form.setFieldValue('value', max);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.handleChange(event);
  };

  return (
    <>
      <Button
        color='primary'
        onClick={handleClick}
        {...other}
      >
        {text}
      </Button>
      <Dialog
        action={
          <>
            <Button
              onClick={_close}
              size='small'
            >
              Close
            </Button>
            <TxButton
              disabled={checkDisabled()}
              method='adjustLoan'
              onSuccess={_close}
              params={getParams()}
              section='honzon'
              size='small'
            >
              Confirm
            </TxButton>
          </>
        }
        className={classes.dialog}
        title={getDialogTitle()}
        visiable={status}
      >
        <BalanceInput
          error={!!form.errors.value}
          id='value'
          name='value'
          onChange={handleChange}
          onMax={handleMax}
          showMaxBtn={type !== 'generate'}
          token={checkOperateStableCurrency() ? stableCurrency : token}
          value={form.values.value}
        />
        <List
          className={classes.list}
          config={config}
          data={listData}
          itemClassName={classes.listItem}
        />
      </Dialog>
    </>
  );
};
