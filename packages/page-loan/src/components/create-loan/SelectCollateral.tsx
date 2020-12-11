import React, { FC, useContext, useState, useCallback, useMemo, useRef, useEffect, ReactNode } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { useConstants, useAllUserLoans, useBalance, useAllBalances } from '@acala-dapp/react-hooks';
import { Table, ColumnsType, Radio, Button, styled } from '@acala-dapp/ui-components';
import { Token, tokenEq, UserAssetBalance, UserAssetValue, Price, StableFeeAPR, RequiredCollateralRatio, LiquidationRatio, LiquidationPenalty, isSimilarZero } from '@acala-dapp/react-components';

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

const BalanceRoot = styled.div`
  display: flex;
  flex-direction: column;

  .balance__balance {
    font-size: 20px;
    line-height: 24px;
    font-weight: bold;
    color: var(--text-color-primary);
  }
  .balance__value {
    font-size: 16px;
    line-height: 19px;
    color: var(--text-color-second);
  }
`;

const Balance: FC<{ currency: CurrencyId }> = ({ currency }) => {
  return (
    <BalanceRoot>
      <UserAssetBalance className='balance__balance'
        currency={currency} />
      <UserAssetValue className='balance__value'
        currency={currency} />
    </BalanceRoot>
  );
};

const SelectCollateralRoot = styled.div``;

const ActionRoot = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
  padding: 0 24px;

  button {
    margin-left: 20px;
  }
`;

export const SelectCollateral: FC = () => {
  const { loanCurrencies } = useConstants();
  const loans = useAllUserLoans(true);
  const balances = useAllBalances();
  const [selected, setSelected] = useState<CurrencyId>();
  const { cancelCreate, setSelectedToken, setStep } = useContext(createProviderContext);
  const collateralDisabled = useRef<Map<string, boolean>>(new Map());

  const data = useMemo(() => {
    return loanCurrencies.map((currency) => ({ currency }));
  }, [loanCurrencies]);

  // if the loan is exit, disable select
  useEffect(() => {
    if (!loans) return;

    loans.forEach(({ currency }) => {
      collateralDisabled.current.set(currency.toString(), false);
    });
  }, [loans]);

  // if the balance is too small, disable select
  useEffect(() => {
    if (!balances) return;

    loanCurrencies.forEach((currency): void => {
      const balance = balances.find((item) => tokenEq(item.currency, currency));

      if (!balance) {
        collateralDisabled.current.set(currency.toString(), true);
      }

      collateralDisabled.current.set(
        currency.toString(),
        !!(balance && isSimilarZero(balance.balance))
      );
    });
  }, [loanCurrencies, balances]);

  const handleSelect = useCallback((token: CurrencyId): void => {
    if (collateralDisabled.current.get(token.toString())) return;

    setSelected(token);
  }, [setSelected]);

  const handleNext = useCallback((): void => {
    if (!selected) return;

    setStep('generate');
    setSelectedToken(selected);
  }, [setStep, setSelectedToken, selected]);

  const isNextDisabled = useMemo(() => !selected, [selected]);

  const tableConfig: ColumnsType<{ currency: CurrencyId}> = useMemo(() => [
    {
      align: 'left',
      key: 'currency',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => {
        // disabled selector when loan exisit
        const isDisabled = collateralDisabled.current.get(currency.toString()) || false;
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
      key: 'avail-balance',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => <Balance currency={currency} />,
      title: 'Avail.Balance'
    },
    {
      align: 'right',
      key: 'price',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => <Price currency={currency} />,
      title: 'Price'
    },
    {
      align: 'right',
      key: 'interest-rate',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => <StableFeeAPR currency={currency} />,
      title: 'Interest Rate'
    },
    {
      align: 'right',
      key: 'min-collateral',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => <RequiredCollateralRatio currency={currency} />,
      title: 'Min.Collateral'
    },
    {
      align: 'right',
      key: 'LIQ-ratio',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => <LiquidationRatio currency={currency} />,
      title: 'LIQ Ratio'
    },
    {
      align: 'right',
      key: 'LIQ-fee',
      /* eslint-disable-next-line react/display-name */
      render: ({ currency }): ReactNode => <LiquidationPenalty currency={currency} />,
      title: 'LIQ Fee'
    }
  ], [selected, handleSelect]);

  const onRow = useCallback((row) => ({
    onClick: (): void => handleSelect(row.currency)
  }), [handleSelect]);

  return (
    <SelectCollateralRoot>
      <Table
        columns={tableConfig}
        dataSource={data}
        onRow={onRow}
        pagination={false}
        rowKey='currency'
      />
      <ActionRoot>
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
      </ActionRoot>
    </SelectCollateralRoot>
  );
};
