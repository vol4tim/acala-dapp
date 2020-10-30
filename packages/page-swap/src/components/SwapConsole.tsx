import React, { FC, useContext, ReactElement, ReactNode, useCallback, useMemo, useState } from 'react';
import { Form } from 'antd';

import { ITuple } from '@polkadot/types/types';
import { Balance } from '@acala-network/types/interfaces';

import { Card, IconButton, InputField } from '@acala-dapp/ui-components';
import { TxButton, BalanceInputValue, UserBalance, LPExchangeRate, getDexShareFromCurrencyId, BalanceInput } from '@acala-dapp/react-components';
import { useApi, useSubscription, useBalance } from '@acala-dapp/react-hooks';

import classes from './SwapConsole.module.scss';
import { SwapInfo } from './SwapInfo';
import { SlippageInput } from './SlippageInput';
import { SwapInput } from './SwapInput';
import { SwapContext } from './SwapProvider';
import { token2CurrencyId, currencyId2Token, FixedPointNumber } from '@acala-network/sdk-core';
import { SwapTrade } from '@acala-network/sdk-swap';
import { TradeParameters } from '@acala-network/sdk-swap/trade-parameters';
import { SwapTradeMode } from '@acala-network/sdk-swap/help';

const DANGER_TRADE_IMPACT = new FixedPointNumber(0.05);

interface SwapBtn {
  onClick: () => void;
}

function SwapBtn ({ onClick }: SwapBtn): ReactElement {
  return (
    <IconButton
      className={classes.swapBtn}
      icon='swap'
      onClick={onClick}
      size='large'
      type='border'
    />
  );
}

export const SwapConsole: FC = () => {
  const { api } = useApi();
  const form = Form.useForm({ });

  const [parameters, setParameters] = useState<TradeParameters | null>(null);

  const {
    availableTokens,
    swapTrade,
    updateUserInput,
    userInput
  } = useContext(SwapContext);

  // reverse input and output
  const handleReverse = useCallback(() => {
    updateUserInput({
      inputAmount: 0,
      inputToken: userInput.outputToken,
      mode: userInput.mode,
      outputAmount: 0,
      outputToken: userInput.inputToken
    });
  }, [userInput, updateUserInput]);

  const balance = useBalance(token2CurrencyId(api, userInput.inputToken));

  const handleMax = useCallback(() => {
    updateUserInput({
      inputAmount: balance.toNumber(),
      mode: 'EXACT_INPUT',
      updateOrigin: 'outset'
    });
  }, [balance, updateUserInput]);

  const handleSuccess = useCallback(() => {
    updateUserInput({
      inputAmount: 0,
      outputAmount: 0
    });
  }, [updateUserInput]);

  const params = useMemo(() => {
    if (!parameters || !swapTrade) return [];

    const result = parameters.toChainData(swapTrade.mode);

    return result;
  }, [parameters, swapTrade]);

  const setTradeMode = useCallback((mode: SwapTradeMode) => {
    updateUserInput({ mode });
  }, [updateUserInput]);

  const setInput = useCallback((value: BalanceInputValue) => {
    updateUserInput({
      inputAmount: value.amount,
      inputToken: currencyId2Token(value.token),
      updateOrigin: 'outset'
    });
  }, [updateUserInput]);

  const setOutput = useCallback((value: BalanceInputValue) => {
    updateUserInput({
      outputAmount: value.amount,
      outputToken: currencyId2Token(value.token),
      updateOrigin: 'outset'
    });
  }, [updateUserInput]);

  useSubscription(() => {
    if (!api) return;
    if (!swapTrade) return;

    const usedTokenPairs = swapTrade.getTradeTokenPairsByPaths();

    return api.queryMulti<ITuple<[Balance, Balance]>[]>(
      usedTokenPairs.map((item) => [api.query.dex.liquidityPool, item.toChainData()])
    ).subscribe((result) => {
      const pools = SwapTrade.convertLiquidityPoolsToTokenPairs(usedTokenPairs, result);
      const parameters = swapTrade.getTradeParameters(pools);

      setParameters(parameters);

      updateUserInput({
        inputAmount: parameters.input.amount.toNumber(),
        outputAmount: parameters.output.amount.toNumber(),
        updateOrigin: 'inner'
      });
    });
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [api, swapTrade, setParameters]);

  return (
    <Card className={classes.root}
      padding={false}>
      <div className={classes.main}>
        <InputField
          actionRender={(): JSX.Element => {
            return (
              <TxButton
                disabled={false}
                method={swapTrade?.mode === 'EXACT_INPUT' ? 'swapWithExactSupply' : 'swapWithExactTarget'}
                onExtrinsicSuccess={handleSuccess}
                params={params}
                section='dex'
                size='large'
                style={parameters?.priceImpact.isGreaterThan(DANGER_TRADE_IMPACT) ? 'danger' : 'primary'}
              >
                {parameters?.priceImpact.isGreaterThan(DANGER_TRADE_IMPACT) ? 'Swap Anyway' : 'Swap'}
              </TxButton>
            );
          }}
          leftRender={(): JSX.Element => {
            return (
              <BalanceInput
                className={classes.inputLeft}
                disableTokens={[token2CurrencyId(api, userInput.outputToken)]}
                enableTokenSelect
                error={''}
                onChange={setInput}
                onFocus={(): void => setTradeMode('EXACT_INPUT')}
                onMax={handleMax}
                selectableTokens={Array.from(availableTokens).map((item) => token2CurrencyId(api, item))}
                showMaxBtn={true}
                value={{
                  amount: userInput.inputAmount,
                  token: token2CurrencyId(api, userInput.inputToken)
                }}
              />
            );
          }}
          leftTitle={(): JSX.Element => {
            return (
              <div>
                <p>{`Pay With${userInput.mode === 'EXACT_OUTPUT' ? ' (Estimate)' : ''}`}</p>
                <div className={classes.extra}>
                  <span>max: </span>
                  <UserBalance token={token2CurrencyId(api, userInput.inputToken)} />
                </div>
              </div>
            );
          }}
          rightRender={(): JSX.Element => {
            return (
              <BalanceInput
                className={classes.inputRight}
                disableTokens={[token2CurrencyId(api, userInput.inputToken)]}
                enableTokenSelect
                error={''}
                onChange={setOutput}
                onFocus={(): void => setTradeMode('EXACT_OUTPUT')}
                selectableTokens={Array.from(availableTokens).map((item) => token2CurrencyId(api, item))}
                value={{
                  amount: userInput.outputAmount,
                  token: token2CurrencyId(api, userInput.outputToken)
                }}
              />
            );
          }}
          rightTitle={(): JSX.Element => {
            return (
              <div>{`Receive${userInput.mode === 'EXACT_INPUT' ? ' (Estimate)' : ''}`}</div>
            );
          }}
          separation={(): JSX.Element => {
            return <SwapBtn onClick={handleReverse} />;
          }}
        />
      </div>
      <SlippageInput />
    </Card>
  );
};
