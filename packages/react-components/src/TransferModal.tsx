import React, { FC, useState, ReactNode, useCallback, useMemo } from 'react';
import clsx from 'clsx';

import { CurrencyId } from '@acala-network/types/interfaces';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { Dialog, ArrowDownIcon, CheckedCircleIcon, FormItem, Button } from '@acala-dapp/ui-components';
import { useModal, useConstants } from '@acala-dapp/react-hooks';

import { getTokenName, tokenEq, numToFixed18Inner } from './utils';
import { TokenName, TokenImage, TokenFullName } from './Token';
import { AssetBalance, AssetAmount } from './Assets';
import classes from './TransferModal.module.scss';
import { AddressInput } from './AddressInput';
import { BalanceAmountInput } from './BalanceAmountInput';
import { TxButton } from './TxButton';

interface AssetBoardProps {
  currency: CurrencyLike;
  openSelect: () => void;
}

const AssetBoard: FC<AssetBoardProps> = ({
  currency,
  openSelect
}) => {
  return (
    <div className={classes.assetBoard}>
      <div className={classes.title}>
        <TokenName currency={currency} /> Balance
      </div>
      <div className={classes.content}
        onClick={openSelect} >
        <div>
          <div className={classes.balance}>
            <AssetBalance
              currency={currency}
              decimalLength={2}
            />
            <TokenName
              className={classes.token}
              currency={currency}
            />
            <ArrowDownIcon className={classes.icon} />
          </div>
          <AssetAmount
            className={classes.amount}
            currency={currency}
            prefix='≈ US$'
            withTooltip={false}
          />
        </div>
      </div>
    </div>
  );
};

interface SelectCurrencyProps {
  selected: CurrencyLike;
  onSelect: (currency: CurrencyLike) => void;
}

const SelectCurrency: FC<SelectCurrencyProps> = ({
  onSelect,
  selected
}) => {
  const { allCurrencies } = useConstants();

  return (
    <div className={classes.selectCurrency}>
      <ul className={classes.content}>
        {
          allCurrencies.map((item: CurrencyId): ReactNode => {
            const active = tokenEq(item, selected);

            return (
              <li
                className={clsx(classes.item, { [classes.active]: active })}
                key={`currency-${item}`}
                onClick={(): void => onSelect(item) }
              >
                { active ? <CheckedCircleIcon className={classes.selected} /> : null }
                <TokenImage
                  currency={item}
                />
                <TokenName
                  className={classes.name}
                  currency={item}
                />
                <TokenFullName
                  className={classes.fullName}
                  currency={item}
                />
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

interface TransferFormProps {
  currency: CurrencyLike;
  onCurrencyChange: (currency: CurrencyLike) => void;
  onAccountChange: (account: string) => void;
  onAccountError: (error: boolean) => void;
  onBalanceChange: (balance: number) => void;
  onBalanceError: (error: boolean) => void;
}

const TransferForm: FC<TransferFormProps> = ({
  currency,
  onAccountChange,
  onAccountError,
  onBalanceChange,
  onBalanceError,
  onCurrencyChange
}) => {
  return (
    <>
      <FormItem
        className={classes.formItem}
        label='Account'
      >
        <AddressInput
          id='account'
          name='account'
          onAddressChange={onAccountChange}
          onError={onAccountError}
        />
      </FormItem>
      <FormItem
        label='Amount'
      >
        <BalanceAmountInput
          currency={currency}
          onBalanceChange={onBalanceChange}
          onCurrencyChange={onCurrencyChange}
          onError={onBalanceError}
        />
      </FormItem>
    </>
  );
};

interface TransferModalProps {
  defaultCurrency: CurrencyLike;
  visiable: boolean;
  onClose: () => void;
}

/**
 * @name TransferModal
 * @description a modal for transfer asset
 */
export const TransferModal: FC<TransferModalProps> = ({
  defaultCurrency,
  onClose,
  visiable
}) => {
  const [currency, setCurrency] = useState<CurrencyLike>(defaultCurrency);
  const { close, open, status: selectCurrencyStatus } = useModal();
  const [account, setAccount] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [accountError, setAccountError] = useState<boolean>(true);
  const [amountError, setAmountError] = useState<boolean>(true);

  const renderHeader = useCallback((): string => {
    return `Transfer ${getTokenName(currency)}`;
  }, [currency]);

  const renderTransfer = (): JSX.Element => {
    return (
      <TransferForm
        currency={currency}
        onAccountChange={setAccount}
        onAccountError={setAccountError}
        onBalanceChange={setAmount}
        onBalanceError={setAmountError}
        onCurrencyChange={setCurrency}
      />
    );
  };

  const renderSelect = useCallback((): ReactNode => {
    const handleSelect = (currency: CurrencyLike): void => {
      setCurrency(currency);
      setTimeout(close, 300);
    };

    return (
      <SelectCurrency
        onSelect={handleSelect}
        selected={currency}
      />
    );
  }, [close, currency, setCurrency]);

  const params = useMemo(() => {
    return [account, currency, numToFixed18Inner(amount)];
  }, [account, currency, amount]);

  const isDisabled = useMemo((): boolean => {
    if (!amount) {
      return true;
    }

    if (!account) {
      return true;
    }

    return accountError || amountError;
  }, [amount, account, accountError, amountError]);

  return (
    <Dialog
      action={
        <>
          <Button
            onClick={onClose}
            size='small'
          >
              Close
          </Button>
          <TxButton
            disabled={isDisabled}
            method='transfer'
            onSuccess={onClose}
            params={params}
            section='currencies'
            size='small'
          >
              Confirm
          </TxButton>
        </>
      }
      onClose={onClose}
      title={renderHeader()}
      visiable={visiable}
      withClose
    >
      <AssetBoard
        currency={currency}
        openSelect={open}
      />
      { selectCurrencyStatus ? renderSelect() : renderTransfer() }
    </Dialog>
  );
};
