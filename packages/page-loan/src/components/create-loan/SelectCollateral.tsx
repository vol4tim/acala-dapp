import React, { FC, useContext, useState, useCallback, useMemo, useRef, useEffect, ReactNode } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { useConstants, useAllUserLoans, useBalance } from '@acala-dapp/react-hooks';
import { Table, TableConfig, Radio, Button } from '@acala-dapp/ui-components';
import { Token, tokenEq, UserAssetBalance, UserAssetValue, Price, StableFeeAPR, RequiredCollateralRatio, LiquidationRatio, LiquidationPenalty } from '@acala-dapp/react-components';

import classes from './SelectCollateral.module.scss';
import { createProviderContext } from './CreateProvider';

interface SelectProps {
  currency: CurrencyId;
  disabled: boolean;
  onClick: (currency: CurrencyId) => void;
  selected: boolean;
}

const Select: FC<SelectProps> = ({
  currency,
  disabled,
  onClick,
  selected
}) => {
  const balance = useBalance(currency);

  return (
    <Radio
      checked={selected}
      disabled={disabled || balance.isZero()}
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

const Balance: FC<{ currency: CurrencyId }> = ({ currency }) => {
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
  const loans = useAllUserLoans(true);
  const [selected, setSelected] = useState<CurrencyId>();
  const { cancelCreate, setSelectedToken, setStep } = useContext(createProviderContext);
  const collateralDisabled = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!loans) return;

    loans.forEach(({ currency }) => {
      collateralDisabled.current.set(currency.toString(), false);
    });
  }, [loans]);

  const handleRowClick = useCallback((_event: any, data: CurrencyId) => {
    if (collateralDisabled.current.get(data.toString()) !== false) {
      setSelected(data);
    }
  }, [setSelected]);

  const handleSelect = useCallback((token: CurrencyId): void => {
    setSelected(token);
  }, [setSelected]);

  const handleNext = useCallback((): void => {
    if (!selected) return;

    setStep('generate');
    setSelectedToken(selected);
  }, [setStep, setSelectedToken, selected]);

  const isNextDisabled = useMemo(() => !selected, [selected]);

  const tableConfig: TableConfig[] = useMemo(() => [
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyId): ReactNode => {
        if (!loans) return null;

        const loan = loans.find((item) => tokenEq(item.currency, currency));
        // disabled selector when loan exisit
        const isDisabled = !!loan;
        const isSelected = !!selected && tokenEq(selected, currency);

        return (
          <Select
            currency={currency}
            disabled={isDisabled}
            onClick={handleSelect}
            selected={isSelected}
          />
        );
      },
      title: 'Collateral Type'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <Balance currency={token} />,
      title: 'Avail.Balance'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyId): ReactNode => <Price currency={currency} />,
      title: 'Price'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyId): ReactNode => <StableFeeAPR currency={currency} />,
      title: 'Interest Rate'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyId): ReactNode => <RequiredCollateralRatio currency={currency} />,
      title: 'Min.Collateral'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyId): ReactNode => <LiquidationRatio currency={currency} />,
      title: 'LIQ Ratio'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (currency: CurrencyId): ReactNode => <LiquidationPenalty currency={currency} />,
      title: 'LIQ Fee'
    }
  ], [selected, handleSelect, loans]);

  return (
    <div className={classes.root}>
      <Table<CurrencyId>
        config={tableConfig}
        data={loanCurrencies}
        rawProps={{
          onClick: handleRowClick
        }}
        showHeader
      />
      <div className={classes.action}>
        <Button
          onClick={cancelCreate}
          size='small'
          type='border'
        >
          Cancel
        </Button>
        <Button
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
