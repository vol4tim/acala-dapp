import React, { FC, useContext, useState, useCallback, useMemo, useRef, useEffect, ReactNode } from 'react';

import { useUserLoan, useConstants, useAllUserLoans } from '@acala-dapp/react-hooks';
import { Table, TableConfig, Radio, Button } from '@acala-dapp/ui-components';
import { Token, tokenEq, UserAssetBalance, UserAssetValue, Price, StableFeeAPR, RequiredCollateralRatio, LiquidationRatio, LiquidationPenalty } from '@acala-dapp/react-components';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

import classes from './SelectCollateral.module.scss';
import { createProviderContext } from './CreateProvider';
import { LoanContext } from './LoanProvider';

interface SelectProps {
  currency: CurrencyLike;
  onClick: (currency: CurrencyLike) => void;
  selected: CurrencyLike;
}

const Select: FC<SelectProps> = ({
  currency,
  onClick,
  selected
}) => {
  const loan = useUserLoan(currency);

  if (!loan) {
    return null;
  }

  return (
    <Radio
      checked={tokenEq(currency, selected)}
      disabled={!loan.collaterals.isEmpty}
      label={
        <Token
          currency={currency}
          fullname
          icon
        />
      }
      onClick={(): void => onClick(currency)}
    />
  );
};

const Balance: FC<{ currency: CurrencyLike}> = ({ currency }) => {
  return (
    <div className={classes.balanceArea}>
      <UserAssetBalance className={classes.balance}
        currency={currency} />
      <UserAssetValue className={classes.amount}
        currency={currency} />
    </div>
  );
};

export const SelectCollateral: FC = () => {
  const { loanCurrencies } = useConstants();
  const [selected, setSelected] = useState<CurrencyLike>('');
  const loans = useAllUserLoans(true);
  const { setSelectedToken, setStep } = useContext(createProviderContext);
  const { cancelCurrentTab } = useContext(LoanContext);
  const collateralDisabled = useRef<{[k in string]: boolean}>({});

  useEffect(() => {
    if (!loans) return;

    loans.forEach(({ token }) => {
      if (loans.findIndex((item): boolean => tokenEq(item.token, token)) !== -1) {
        collateralDisabled.current[token.toString()] = false;
      }
    });
  }, [loans]);

  const handleRowClick = useCallback((_event: any, data: CurrencyLike) => {
    if (collateralDisabled.current[data.toString()] !== false) {
      setSelected(data);
    }
  }, [setSelected]);

  const handleSelect = useCallback((token: CurrencyLike): void => {
    setSelected(token);
  }, [setSelected]);

  const handleNext = useCallback((): void => {
    setStep('generate');
    setSelectedToken(selected);
  }, [setStep, setSelectedToken, selected]);

  const isNextDisabled = useMemo((): boolean => !selected, [selected]);

  const tableConfig: TableConfig[] = useMemo(() => [
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyLike): ReactNode => (
        <Select
          currency={currency}
          onClick={handleSelect}
          selected={selected}
        />
      ),
      title: 'Collateral Type'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyLike): ReactNode => <Balance currency={token} />,
      title: 'Avail.Balance'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyLike): ReactNode => <Price currency={currency} />,
      title: 'Price'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyLike): ReactNode => <StableFeeAPR currency={currency} />,
      title: 'Interest Rate'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyLike): ReactNode => <RequiredCollateralRatio currency={currency} />,
      title: 'Min.Collateral'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyLike): ReactNode => <LiquidationRatio currency={currency} />,
      title: 'LIQ Ratio'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyLike): ReactNode => <LiquidationPenalty currency={currency} />,
      title: 'LIQ Fee'
    }
  ], [selected, handleSelect]);

  return (
    <div className={classes.root}>
      <Table<CurrencyLike>
        config={tableConfig}
        data={loanCurrencies}
        rawProps={{
          onClick: handleRowClick
        }}
        showHeader
      />
      <div className={classes.action}>
        <Button
          onClick={cancelCurrentTab}
          size='small'
          type='border'
        >
          Cancel
        </Button>
        <Button
          color='primary'
          disabled={isNextDisabled}
          onClick={handleNext}
          size='small'
        >
          Next
        </Button>
      </div>
    </div>
  );
};
