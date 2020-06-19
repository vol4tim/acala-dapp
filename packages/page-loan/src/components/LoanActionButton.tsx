import React, { FC, ChangeEvent, ReactNode, useMemo, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { stableCoinToDebit, Fixed18, convertToFixed18, calcLiquidationPrice, calcCollateralRatio } from '@acala-network/app-util';

import { Dialog, ButtonProps, Button, List, ListConfig } from '@acala-dapp/ui-components';
import { useModal, useFormValidator, useConstants, useBalance, useLoanHelper } from '@acala-dapp/react-hooks';
import { BalanceInput, TxButton, FormatBalance, FormatFixed18 } from '@acala-dapp/react-components';

import classes from './LoanActionButton.module.scss';

type ActionType = 'payback' | 'generate' | 'deposit' | 'withdraw';

interface Props extends Omit<ButtonProps, 'onClick' | 'type'> {
  type: ActionType;
  text: string;
  token: CurrencyId | string;
}

export const LonaActionButton: FC<Props> = ({
  text,
  token,
  type,
  ...other
}) => {
  const { close, open, status } = useModal(false);
  const { minmumDebitValue, stableCurrency } = useConstants();
  const balance = useBalance(token);
  const stableCurrencyBalance = useBalance(stableCurrency);
  const loanHelper = useLoanHelper(token);

  const maxInput = useMemo(() => {
    if (!balance || !loanHelper || !stableCurrencyBalance) return 0;

    if (type === 'payback') {
      return convertToFixed18(stableCurrencyBalance).min(loanHelper.canPayBack).toNumber(2, 3);
    }

    if (type === 'generate') {
      return loanHelper.canGenerate.toNumber();
    }

    if (type === 'deposit') {
      return convertToFixed18(balance).toNumber();
    }

    if (type === 'withdraw') {
      return loanHelper.collaterals.sub(loanHelper.requiredCollateral).toNumber();
    }

    return 0;
  }, [balance, loanHelper, stableCurrencyBalance, type]);

  const validator = useFormValidator({
    value: {
      max: maxInput,
      min: 0,
      type: 'number'
    }
  });

  const form = useFormik({
    initialValues: {
      value: (('' as any) as number)
    },
    onSubmit: noop,
    validate: validator
  });

  const collateral = useMemo<number>((): number => {
    if (!form.values.value) return 0;

    if (type === 'deposit') {
      return form.values.value;
    }

    if (type === 'withdraw') {
      return -form.values.value;
    }

    return 0;
  }, [form.values, type]);

  const debit = useMemo<number>((): number => {
    if (!form.values.value) return 0;

    if (type === 'generate') {
      return form.values.value;
    }

    if (type === 'payback') {
      return -form.values.value;
    }

    return 0;
  }, [form.values, type]);

  const newLiquidationPrice = useMemo<Fixed18>(() => {
    if (!loanHelper) return Fixed18.ZERO;

    return calcLiquidationPrice(
      loanHelper.collaterals.add(Fixed18.fromNatural(collateral)),
      loanHelper.debitAmount.add(Fixed18.fromNatural(debit)),
      loanHelper.liquidationRatio
    );
  }, [collateral, debit, loanHelper]);

  const newCollateralRatio = useMemo(() => {
    if (!loanHelper) return Fixed18.ZERO;

    return calcCollateralRatio(
      loanHelper.collaterals.add(Fixed18.fromNatural(collateral)).mul(loanHelper.collateralPrice),
      loanHelper.debitAmount.add(Fixed18.fromNatural(debit))
    );
  }, [collateral, debit, loanHelper]);

  const isStableCurrency = useMemo((): boolean => {
    return type === 'payback' || type === 'generate';
  }, [type]);

  const dialogTitle = useMemo((): string => {
    const _token = isStableCurrency ? stableCurrency : token;

    return `${text} ${_token}`;
  }, [isStableCurrency, stableCurrency, text, token]);

  const handleClick = useCallback((): void => {
    open();
  }, [open]);

  const getParams = (): string[] => {
    const params = [token.toString(), '0', '0'];

    if (!form.values.value || !loanHelper) {
      return params;
    }

    switch (type) {
      case 'payback': {
        if (
          Fixed18.fromNatural(form.values.value)
            .sub(loanHelper.debitAmount)
            .negated()
            .isLessThan(minmumDebitValue)
        ) {
          params[2] = loanHelper.debits.negated().innerToString();
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
          loanHelper.collaterals
            .sub(Fixed18.fromNatural(form.values.value))
            .isLessThan(Fixed18.fromNatural(0.0000001))
        ) {
          params[1] = loanHelper.collaterals.negated().innerToString();
        } else {
          params[1] = Fixed18.fromNatural(form.values.value).negated().innerToString();
        }

        break;
      }
    }

    return params;
  };

  const isDisabled = useMemo((): boolean => {
    if (!form.values.value) {
      return true;
    }

    if (form.errors.value) {
      return true;
    }

    return false;
  }, [form.values, form.errors]);

  const config: ListConfig[] = [
    {
      key: 'borrowed',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => {
        return <FormatBalance balance={value} />;
      },
      title: 'Borrowed aUSD'
    },
    {
      key: 'collateralRate',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => {
        return (
          <FormatFixed18
            data={value}
            format='percentage'
          />
        );
      },
      title: 'New Collateral Ratio'
    },
    {
      key: 'liquidationPrice',
      /* eslint-disable-next-line react/display-name */
      render: (value): ReactNode => {
        return (
          <FormatFixed18
            data={value}
            prefix='$'
          />
        );
      },
      title: 'New Liquidation Price'
    }
  ];

  const _close = (): void => {
    close();
    form.resetForm();
  };

  const formatListData = useCallback((value: Fixed18): Fixed18 => {
    if (form.errors.value) {
      return Fixed18.fromNatural(NaN);
    }

    return value || Fixed18.fromNatural(NaN);
  }, [form.errors]);

  const listData = useMemo(() => {
    if (!loanHelper) return {};

    return {
      borrowed: formatListData(loanHelper.debitAmount),
      canGenerate: formatListData(loanHelper.canGenerate),
      collateralRate: formatListData(newCollateralRatio),
      liquidationPrice: formatListData(newLiquidationPrice)
    };
  }, [loanHelper, newCollateralRatio, newLiquidationPrice, formatListData]);

  const showMaxBtn = useMemo<boolean>((): boolean => {
    return type !== 'generate';
  }, [type]);

  const handleMax = (): void => {
    form.setFieldValue('value', maxInput);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
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
              disabled={isDisabled}
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
        title={dialogTitle}
        visiable={status}
      >
        <BalanceInput
          error={form.errors.value}
          id='value'
          name='value'
          onChange={handleChange}
          onMax={handleMax}
          showMaxBtn={showMaxBtn}
          token={isStableCurrency ? stableCurrency : token}
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
