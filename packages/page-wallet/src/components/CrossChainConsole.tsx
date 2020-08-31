import React, { FC, ReactElement, useMemo } from 'react';

import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { TokenImage, TokenName, TokenFullName } from '@acala-dapp/react-components';
import { useConstants } from '@acala-dapp/react-hooks';
import { Tabs } from '@acala-dapp/ui-components';

import classes from './CrossChainConsole.module.scss';
import { RenBtc } from './crosschain/RenBtc';
import { AUSD } from './crosschain/AUSD';

const AssetCard: FC<{ currency: CurrencyLike}> = ({ currency }) => {
  return (
    <div className={classes.assetCard}>
      <div className={classes.assetImg}>
        <TokenImage
          currency={currency}
        />
      </div>
      <div className={classes.assetName}>
        <TokenName currency={currency} />
        <TokenFullName currency={currency} />
      </div>
    </div>
  );
};

const crossChainConsoleList: Map<string, ReactElement> = new Map([
  ['AUSD', <AUSD key='ausd' />],
  ['RENBTC', <RenBtc key='renbtc' />]
]);

const crossChainDisabled: Map<string, boolean> = new Map([
  ['RENBTC', false],
  ['AUSD', false],
  ['DOT', true]
]);

export const CrossChainConsole: FC = () => {
  const { crossChainCurrencies } = useConstants();
  const _currencies = useMemo(() => {
    return crossChainCurrencies.sort((a) => Number(crossChainDisabled.get(a.toString())) - 0.5);
  }, [crossChainCurrencies]);

  return (
    <Tabs
      className={classes.tabs}
      defaultKey='AUSD'
    >
      {
        _currencies.map((currency) => {
          return (
            <Tabs.Panel
              disabled={crossChainDisabled.get(currency.toString())}
              key={currency.toString()}
              tab={<AssetCard currency={currency} />}
            >
              {
                crossChainConsoleList.get(currency.toString())
              }
            </Tabs.Panel>
          );
        })
      }
    </Tabs>
  );
};
