import React, { FC, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import clsx from 'clsx';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Dialog, ArrowDownIcon, CheckedCircleIcon, FormItem, Button, Condition, InlineBlockBox } from '@acala-dapp/ui-components';
import { useModal, useAccounts, useConstants, useLPCurrencies } from '@acala-dapp/react-hooks';

import { tokenEq } from './utils';
import { TokenName, TokenImage, TokenFullName } from './Token';
import { UserAssetBalance, UserAssetValue } from './Assets';
import classes from './TransferModal.module.scss';
import { AddressInput } from './AddressInput';
import { BalanceAmountInput, BalanceAmountValue } from './BalanceAmountInput';
import { TxButton } from './TxButton';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';
import { FixedPointNumber } from '@acala-network/sdk-core';

interface AssetBoardProps {
  currency: CurrencyId;
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
            <UserAssetBalance
              currency={currency}
            />
            <TokenName
              className={classes.token}
              currency={currency}
            />
            <ArrowDownIcon className={classes.icon} />
          </div>
          {
            currency.isToken ? (
              <UserAssetValue
                className={classes.amount}
                currency={currency}
              />
            ) : null
          }
        </div>
      </div>
    </div>
  );
};

interface SelectCurrencyProps {
  selectableCurrencies: CurrencyId[];
  value: CurrencyId;
  onChange: (currency: CurrencyId) => void;
}

const SelectCurrency: FC<SelectCurrencyProps> = ({
  onChange,
  selectableCurrencies,
  value
}) => {
  return (
    <div className={classes.selectCurrency}>
      <ul className={classes.content}>
        {
          selectableCurrencies.map((item: CurrencyId): ReactNode => {
            const active = tokenEq(item, value);

            return (
              <li
                className={clsx(classes.item, { [classes.active]: active })}
                key={`currency-${item}`}
                onClick={(): void => onChange(item) }
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

interface AccountBalanceValue {
  account: string;
  balance: number;
}

interface TransferFormProps {
  mode: 'token' | 'lp-token';
  currency: CurrencyId;
  value: AccountBalanceValue;
  onChange: (value: AccountBalanceValue) => void;
}

const TransferForm: FC<TransferFormProps> = ({
  currency,
  mode,
  onChange,
  value
}) => {
  const { active } = useAccounts();

  const handleAccountChange = useCallback((account: string) => {
    onChange({
      account,
      balance: value.balance
    });
  }, [value, onChange]);

  const handleBalanceAmountInput = useCallback((result: BalanceAmountValue) => {
    onChange({
      account: value.account,
      balance: result.balance
    });
  }, [value, onChange]);

  return (
    <>
      <FormItem
        className={classes.formItem}
        label='Account'
      >
        <AddressInput
          blockAddressList={[active ? active.address : '']}
          onChange={handleAccountChange}
        />
      </FormItem>
      <FormItem
        label='Amount'
      >
        <BalanceAmountInput
          currency={currency}
          mode={mode}
          onChange={handleBalanceAmountInput}
        />
      </FormItem>
    </>
  );
};

interface TransferModalProps {
  mode: 'token' | 'lp-token';
  defaultCurrency: CurrencyId;
  visiable: boolean;
  onClose: () => void;
}

/**
 * @name TransferModal
 * @description a modal for transfer asset
 */
export const TransferModal: FC<TransferModalProps> = ({
  defaultCurrency,
  mode,
  onClose,
  visiable
}) => {
  const { allCurrencies } = useConstants();
  const lpCurrencies = useLPCurrencies();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyId>(defaultCurrency);
  const { close, open, status: isOpenSelect } = useModal();
  const [value, setValue, { reset }] = useInputValue<AccountBalanceValue>({
    account: '',
    balance: 0
  });

  const renderHeader = useCallback((): JSX.Element => {
    return (
      <>
        <InlineBlockBox margin={8}>
          <span>Transfer</span>
        </InlineBlockBox>
        <TokenName currency={selectedCurrency}/>
      </>
    );
  }, [selectedCurrency]);

  const renderTransfer = useCallback((): JSX.Element => {
    return (
      <TransferForm
        currency={selectedCurrency}
        mode={mode}
        onChange={setValue}
        value={value}
      />
    );
  }, [value, setValue, selectedCurrency, mode]);

  const handleTokenSelect = useCallback((value: CurrencyId): void => {
    setSelectedCurrency(value);
    close();
  }, [setSelectedCurrency, close]);

  const renderSelect = useCallback((): ReactNode => {
    return (
      <SelectCurrency
        onChange={handleTokenSelect}
        selectableCurrencies={mode === 'token' ? allCurrencies : lpCurrencies}
        value={selectedCurrency}
      />
    );
  }, [mode, handleTokenSelect, selectedCurrency, allCurrencies, lpCurrencies]);

  const params = useMemo(() => {
    return [value.account, selectedCurrency, new FixedPointNumber(value.balance).toChainData()];
  }, [value, selectedCurrency]);

  const isDisabled = useMemo((): boolean => {
    if (!value.account) {
      return true;
    }

    if (!value.balance) {
      return true;
    }

    return false;
  }, [value]);

  useEffect(() => {
    reset();
  /* eslint-disable-next-line */
  }, [visiable]);

  return (
    <Dialog
      action={
        <Condition condition={!isOpenSelect}>
          <Button
            onClick={onClose}
            size='small'
            style='normal'
            type='border'
          >
              Close
          </Button>
          <TxButton
            disabled={isDisabled}
            method='transfer'
            onExtrinsicSuccess={onClose}
            params={params}
            section='currencies'
            size='small'
          >
              Confirm
          </TxButton>
        </Condition>
      }
      onCancel={onClose}
      title={renderHeader()}
      visiable={visiable}
      withClose
    >
      <AssetBoard
        currency={selectedCurrency}
        openSelect={open}
      />
      { isOpenSelect ? renderSelect() : renderTransfer() }
    </Dialog>
  );
};
