import React, { FC, useContext, ReactElement, useCallback, useMemo, useState, useEffect, useRef } from 'react';

import { ITuple } from '@polkadot/types/types';
import { Balance } from '@acala-network/types/interfaces';

import { Card, IconButton, InputField, SpaceBetweenBox } from '@acala-dapp/ui-components';
import { TxButton, BalanceInputValue, UserBalance, BalanceInput } from '@acala-dapp/react-components';
import { useApi, useSubscription, useBalance, useBalanceValidator } from '@acala-dapp/react-hooks';

import classes from './SwapConsole.module.scss';
import { SwapInfo } from './SwapInfo';
import { SlippageInput } from './SlippageInput';
import { SwapContext } from './SwapProvider';
import { token2CurrencyId, currencyId2Token, FixedPointNumber, TokenPair } from '@acala-network/sdk-core';
import { SwapTrade } from '@acala-network/sdk-swap';
import { TradeParameters } from '@acala-network/sdk-swap/trade-parameters';
import { SwapTradeMode } from '@acala-network/sdk-swap/help';

// const DANGER_TRADE_IMPACT = new FixedPointNumber(0.05);

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

  const [parameters, setParameters] = useState<TradeParameters | null>(null);

  const [inputError, setInputError] = useState<string>();
  const [outputError, setOutputError] = useState<string>();

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
    setParameters(null);
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
    setParameters(null);
  }, [updateUserInput, setParameters]);

  const params = useCallback(() => {
    if (!parameters || !swapTrade) return;

    const result = parameters.toChainData(swapTrade.mode);

    return result;
  }, [parameters, swapTrade]);

  const setTradeMode = useCallback((mode: SwapTradeMode) => {
    updateUserInput({ mode });
  }, [updateUserInput]);

  const balanceValidator = useBalanceValidator({ currency: token2CurrencyId(api, userInput.inputToken) });
  const promiseRef = useRef<any>();

  useEffect(() => {
    // check balance
    promiseRef.current = balanceValidator({
      amount: userInput.inputAmount,
      token: token2CurrencyId(api, userInput.inputToken)
    });

    promiseRef.current.then(() => setInputError(''))
      .catch((e: any) => setInputError(e.message));
  /* eslint-disable-next-line */
  }, [balanceValidator]);

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

  const isDisable = useMemo(() => {
    if (!parameters) return true;

    if (parameters.midPrice.isLessOrEqualTo(FixedPointNumber.ZERO)) return true;

    if (outputError) return true;

    if (inputError) return true;

    if (userInput.outputAmount <= 0) return true;

    if (userInput.inputAmount <= 0) return true;

    return false;
  }, [inputError, outputError, parameters, userInput]);

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

      const { path } = parameters;

      if (path.length >= 2) {
        const tailPair = new TokenPair(path[path.length - 1], path[path.length - 2]);
        const tailPairPool = pools.find((item): boolean => item.isEqual(tailPair));

        if (tailPairPool) {
          // check output is sufficient in pool
          if (parameters.midPrice.isLessOrEqualTo(FixedPointNumber.ZERO)) {
            setOutputError('Insufficient token in the pool');
          } else {
            setOutputError('');
          }
        }
      }

      // check input
      if (parameters.input.amount.isGreaterThan(balance)) {
        setInputError('Insufficient balance');
      } else {
        setInputError('');
      }

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
                disabled={isDisable}
                method={swapTrade?.mode === 'EXACT_INPUT' ? 'swapWithExactSupply' : 'swapWithExactTarget'}
                onInblock={handleSuccess}
                params={params}
                section='dex'
                size='large'
              >
                Swap
              </TxButton>
            );
          }}
          leftRender={(): JSX.Element => {
            return (
              <BalanceInput
                className={classes.inputLeft}
                disableTokens={[token2CurrencyId(api, userInput.outputToken)]}
                enableTokenSelect
                error={inputError}
                onChange={setInput}
                onFocus={(): void => setTradeMode('EXACT_INPUT')}
                onMax={handleMax}
                selectableTokens={Array.from(availableTokens).map((item) => token2CurrencyId(api, item))}
                value={{
                  amount: userInput.inputAmount,
                  token: token2CurrencyId(api, userInput.inputToken)
                }}
              />
            );
          }}
          leftTitle={(): JSX.Element => {
            return (
              <SpaceBetweenBox>
                <p>{`Pay With${userInput.mode === 'EXACT_OUTPUT' ? ' (Estimate)' : ''}`}</p>
                <div className={classes.extra}>
                  <span>max: </span>
                  <UserBalance token={token2CurrencyId(api, userInput.inputToken)} />
                </div>
              </SpaceBetweenBox>
            );
          }}
          rightRender={(): JSX.Element => {
            return (
              <BalanceInput
                checkSelectBalance={false}
                className={classes.inputRight}
                disableTokens={[token2CurrencyId(api, userInput.inputToken)]}
                enableTokenSelect
                error={outputError}
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
      {
        parameters ? (
          <SwapInfo parameters={parameters} />
        ) : null
      }
      <SlippageInput />
    </Card>
  );
};
