import React, { FC } from 'react';
import clsx from 'clsx';

import { BareProps } from '@acala-dapp/ui-components/types';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { Condition } from '@acala-dapp/ui-components';

import classes from './Token.module.scss';
import { getTokenImage, getTokenName, getTokenFullName } from './utils';

interface TokenComponentProps extends BareProps {
  currency: CurrencyLike;
}

const generateTokenComponent = (getFN: (currency: CurrencyLike) => any, wrapperComponent: string, getProps: (data: any) => object, displayName: string): FC<TokenComponentProps> => {
  const Component: FC<TokenComponentProps> = ({ className, currency }) => {
    const content = getFN(currency);

    return content ? React.createElement(wrapperComponent, { className, ...getProps(content) }) : null;
  };

  Component.displayName = displayName;

  return Component;
};

/**
 * @name TokenImage
 * @descript show token image
 * @param currency
 */
export const TokenImage = generateTokenComponent(
  getTokenImage,
  'img',
  (data: any) => ({ src: data }),
  'TokenImage'
);

/**
 * @name TokenName
 * @descript show token name
 * @param currency
 */
export const TokenName = generateTokenComponent(
  getTokenName,
  'span',
  (data: any) => ({ children: data }),
  'TokenName'
);

/**
 * @name TokenFullName
 * @description show token fullname
 * @param currency
 */
export const TokenFullName = generateTokenComponent(
  getTokenFullName,
  'span',
  (data: any) => ({ children: data }),
  'TokenFullName'
);

export interface TokenProps extends BareProps {
  currency: CurrencyLike;
  imageClassName?: string;
  nameClassName?: string;
  fullnameClassName?: string;
  icon?: boolean;
  name?: boolean;
  fullname?: boolean;
  upper?: boolean;
  padding?: boolean;
}

export const Token: FC<TokenProps> = ({
  className,
  currency,
  fullname = false,
  fullnameClassName,
  icon = false,
  imageClassName,
  name = true,
  nameClassName,
  padding = false
}) => {
  if (!currency) {
    return null;
  }

  return (
    <div
      className={
        clsx(
          classes.root,
          className,
          {
            [classes.padding]: padding
          }
        )
      }
    >
      <Condition
        condition={!!icon}
        match={(
          <TokenImage
            className={clsx(classes.icon, imageClassName)}
            currency={currency}
          />
        )}
      />
      <div className={classes.nameArea}>
        <Condition
          condition={name}
          match={(
            <TokenName
              className={clsx(classes.name, nameClassName)}
              currency={currency}
            />
          )}
        />
        <Condition
          condition={fullname}
          match={(
            <TokenFullName
              className={clsx(classes.fullname, fullnameClassName)}
              currency={currency}
            />
          )}
        />
      </div>
    </div>
  );
};
