import React, { FC, useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { noop } from 'lodash';

import { Menu, Dropdown } from 'antd';

import { BareProps } from '@acala-dapp/ui-components/types';
import { ArrowDownIcon } from '@acala-dapp/ui-components';
import { CurrencyId } from '@acala-network/types/interfaces';

import { Token, TokenImage, TokenName } from './Token';
import { tokenEq } from './utils';
import { CurrencyChangeFN } from './types';
import classes from './TokenSelector.module.scss';
import { UserAssetBalance } from './Assets';
import { useBalance } from '@acala-dapp/react-hooks';

interface MenuItemProps {
  value?: CurrencyId;
  currency: CurrencyId;
  disabledCurrencies: CurrencyId[];
  onClick: (currency: CurrencyId) => void;
  [k: string]: any;
}

const MenuItem: FC<MenuItemProps> = ({
  currency,
  disabledCurrencies,
  onClick,
  value,
  ...others
}) => {
  // query currency balance
  const balance = useBalance(currency);

  // if currency in disabledCurrencies or balance is zero, disable this item
  const isDisabled = useMemo(() => {
    if (disabledCurrencies.find((item) => tokenEq(item, currency))) return true;

    if (balance && balance.isZero()) return true;

    return false;
  }, [currency, disabledCurrencies, balance]);

  const isActive = useMemo(() => value && tokenEq(currency, value), [currency, value]);

  return (
    <Menu.Item
      className={
        clsx(
          classes.item,
          { [classes.active]: isActive }
        )
      }
      disabled={isDisabled}
      key={currency.toString()}
      onClick={(): void => onClick(currency)}
      {...others}
    >
      <TokenImage
        className={classes.tokenImage}
        currency={currency}
      />
      <div className={classes.tokenDetail}>
        <TokenName
          className={classes.tokenName}
          currency={currency}
        />
        <UserAssetBalance
          className={classes.assetBalance}
          currency={currency} />
      </div>
    </Menu.Item>
  );
};

interface Props extends BareProps {
  currencies: CurrencyId[];
  disabledCurrencies?: CurrencyId[];
  value?: CurrencyId;
  onChange?: CurrencyChangeFN;
  showIcon?: boolean;
  showDetail?: boolean;
}

export const TokenSelector: FC<Props> = ({
  currencies,
  disabledCurrencies = [],
  onChange = noop,
  value,
  showIcon
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  const _onChange = useCallback((currency: CurrencyId) => {
    if (onChange) {
      onChange(currency);
    }

    setVisible(false);
  }, [onChange]);

  return (
    <Dropdown
      getPopupContainer={(triggerNode): any => triggerNode.parentNode}
      onVisibleChange={setVisible}
      overlay={(
        <Menu>
          {
            currencies.map((currency) => {
              return (
                <MenuItem
                  currency={currency}
                  disabledCurrencies={disabledCurrencies}
                  key={`token-selector-${currency.toString()}`}
                  onClick={_onChange}
                  value={value}
                />
              );
            })
          }
        </Menu>
      )}
      trigger={['click']}
      visible={visible}
    >
      <div className={classes.selected}>
        {
          value ? (
            <Token
              className={classes.token}
              currency={value}
              icon={showIcon}
            />
          ) : null
        }
        <ArrowDownIcon className={classes.arrow} />
      </div>
    </Dropdown>
  );
};
