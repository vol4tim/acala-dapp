import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { noop } from 'lodash';

import { Menu, Dropdown } from 'antd';

import { BareProps } from '@acala-dapp/ui-components/types';
import { useApi, useConstants } from '@acala-dapp/react-hooks';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { ArrowDownIcon } from '@acala-dapp/ui-components';

import { Token, TokenImage, TokenName } from './Token';
import { getCurrencyIdFromName, tokenEq } from './utils';
import { CurrencyChangeFN } from './types';
import classes from './TokenSelector.module.scss';
import { UserAssetBalance } from './Assets';

interface Props extends BareProps {
  currencies?: CurrencyLike[];
  disabledCurrencies?: CurrencyLike[];
  value?: CurrencyLike;
  onChange?: CurrencyChangeFN;
  showIcon?: boolean;
  showDetail?: boolean;
}

export const TokenSelector: FC<Props> = ({
  currencies,
  disabledCurrencies,
  onChange = noop,
  value,
  showIcon
}) => {
  const { api } = useApi();
  const [_currencies, setCurrencies] = useState<(CurrencyLike)[]>([]);
  const { allCurrencies } = useConstants();
  const [visible, setVisible] = useState<boolean>(false);

  const _onChange = useCallback((currency: CurrencyLike) => {
    if (onChange) {
      onChange(currency);
    }

    setVisible(false);
  }, [onChange]);

  // format currencies and set default vlaue if need
  useEffect(() => {
    // set default currencies
    if (!currencies) {
      setCurrencies(allCurrencies);
    } else {
      // try to convert string to CurrencyId
      const result = currencies.map((item: CurrencyLike): CurrencyLike => {
        return typeof item === 'string' ? getCurrencyIdFromName(api, item) : item;
      });

      setCurrencies(result);
    }
  }, [allCurrencies, api, currencies]);

  const menu = useMemo(() => (
    <Menu>
      {
        _currencies.map((currency) => {
          return (
            <Menu.Item
              className={
                clsx(
                  classes.item,
                  {
                    [classes.active]: tokenEq(currency, value || '')
                  }
                )
              }
              disabled={disabledCurrencies ? !!disabledCurrencies.find((item): boolean => tokenEq(item, currency)) : false}
              key={currency.toString()}
              onClick={(): void => _onChange(currency)}
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
        })
      }
    </Menu>
  ), [_currencies, disabledCurrencies, _onChange, value]);

  if (!_currencies.length) {
    return null;
  }

  return (
    <Dropdown
      getPopupContainer={(triggerNode): any => triggerNode.parentNode}
      onVisibleChange={setVisible}
      overlay={menu}
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
