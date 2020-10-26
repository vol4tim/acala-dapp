import React, { FC, ReactElement } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { TokenImage, TokenName, TokenFullName } from '@acala-dapp/react-components';
import { useConstants } from '@acala-dapp/react-hooks';
import { Tabs } from '@acala-dapp/ui-components';

import classes from './CrossChainConsole.module.scss';
import { RenBtc } from './cross-chain/RenBtc';
import { AUSD } from './cross-chain/AUSD';
import { DOT } from './cross-chain/DOT';

const AssetCard: FC<{ currency: CurrencyId}> = ({ currency }) => {
  return (
    <div className={classes.assetCard}>
      <div className={classes.assetImg}>
        <TokenImage currency={currency} />
      </div>
      <div className={classes.assetName}>
        <TokenName currency={currency} />
        <TokenFullName currency={currency} />
      </div>
    </div>
  );
};

const crossChainConsoleList: Map<string, ReactElement> = new Map([
  ['RENBTC', <RenBtc key='renbtc' />],
  ['AUSD', <AUSD key='ausd' />],
  ['DOT', <DOT key='dot' />]
]);

const crossChainEnable: Map<string, boolean> = new Map([
  ['RENBTC', true],
  ['AUSD', false],
  ['DOT', false]
]);

export const CrossChainConsole: FC = () => {
  const { crossChainCurrencies } = useConstants();

  return (
    <Tabs
      className={classes.tabs}
      defaultKey='RENBTC'
    >
      {
        crossChainCurrencies.map((currency) => {
          return (
            <Tabs.Panel
              disabled={!crossChainEnable.get(currency.asToken.toString())}
              key={currency.asToken.toString()}
              tab={<AssetCard currency={currency} />}
            >
              {
                crossChainConsoleList.get(currency.asToken.toString())
              }
            </Tabs.Panel>
          );
        })
      }
    </Tabs>
  );
};
