import React, { memo, createContext, FC, PropsWithChildren, useState, useEffect, useCallback, useMemo } from 'react';
import { u32 } from '@polkadot/types';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Token, TokenPair, FixedPointNumber, getPresetToken } from '@acala-network/sdk-core';
import { SwapTrade } from '@acala-network/sdk-swap';
import { Fee, SwapTradeMode } from '@acala-network/sdk-swap/help';

import { useApi } from '@acala-dapp/react-hooks';

export interface PoolData {
  supplyCurrency: CurrencyId;
  targetCurrency: CurrencyId;
  supplySize: number;
  targetSize: number;
}

interface UserInput {
  inputToken: Token;
  outputToken: Token;
  inputAmount: number;
  outputAmount: number;
  acceptSlippage: FixedPointNumber;
  mode: SwapTradeMode;
  updateOrigin: 'inner' | 'outset';
}

interface ContextData {
  exchangeFee: Fee;
  enableTokenPairs: TokenPair[];
  availableTokens: Set<Token>;
  userInput: UserInput;
  updateUserInput: (input: Partial<UserInput>) => void;
  swapTrade: SwapTrade | undefined;
}

export const SwapContext = createContext<ContextData>({} as ContextData);

export const SwapProvider: FC<PropsWithChildren<{}>> = memo(({ children }) => {
  const { api } = useApi();

  const exchangeFee = useMemo<Fee>((): Fee => {
    if (!api) return {} as Fee;

    const exchangeFee = api.consts.dex.getExchangeFee as unknown as [u32, u32];

    return {
      denominator: new FixedPointNumber(exchangeFee[1].toString()),
      numerator: new FixedPointNumber(exchangeFee[0].toString())
    };
  }, [api]);

  const enableTokenPairs = useMemo((): TokenPair[] => {
    if (!api) return [];

    return SwapTrade.getAvailableTokenPairs(api);
  }, [api]);

  const maxTradePathLength = useMemo((): number => {
    if (!api) return 0;

    return parseInt((api.consts.dex.tradingPathLimit as unknown as u32).toString());
  }, [api]);

  const availableTokens = useMemo<Set<Token>>((): Set<Token> => {
    const result: Set<Token> = new Set();

    enableTokenPairs.forEach((item) => {
      item.getPair().forEach((token) => result.add(token));
    });

    return result;
  }, [enableTokenPairs]);

  const [userInput, setUserInput] = useState<UserInput>({
    acceptSlippage: new FixedPointNumber(0.005),
    inputAmount: 0,
    inputToken: getPresetToken('ACA'),
    mode: 'EXACT_INPUT',
    outputAmount: 0,
    outputToken: getPresetToken('AUSD'),
    updateOrigin: 'outset'
  });

  const updateUserInput = useCallback((input: Partial<UserInput>) => {
    setUserInput(Object.assign({}, userInput, input));
  }, [userInput]);

  const [swapTrade, setSwapTrade] = useState<SwapTrade>();

  useEffect(() => {
    const input = userInput.inputToken.clone({
      amount: new FixedPointNumber(userInput.inputAmount)
    });
    const output = userInput.outputToken.clone({
      amount: new FixedPointNumber(userInput.outputAmount)
    });

    const swapTrade = new SwapTrade({
      acceptSlippage: userInput.acceptSlippage,
      availableTokenPairs: enableTokenPairs,
      fee: exchangeFee,
      input,
      maxTradePathLength,
      mode: userInput.mode,
      output
    });

    if (userInput.updateOrigin === 'inner') {
      swapTrade.input = input;
      swapTrade.output = output;
    } else {
      setSwapTrade(swapTrade);
    }
  }, [userInput, enableTokenPairs, exchangeFee, maxTradePathLength]);

  return (
    <SwapContext.Provider value={{
      availableTokens,
      enableTokenPairs,
      exchangeFee,
      swapTrade,
      updateUserInput,
      userInput
    }}>
      {children}
    </SwapContext.Provider>
  );
});

SwapProvider.displayName = 'SwapProvider';
