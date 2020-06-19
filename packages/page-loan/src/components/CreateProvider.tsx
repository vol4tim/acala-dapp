import React, { createContext, useState, FC, useCallback } from 'react';

import { BareProps } from '@acala-dapp/ui-components/types';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

type CREATE_STEP = 'select' | 'generate' | 'confirm' | 'success';

export interface ProviderData {
  step: CREATE_STEP;
  setStep: (step: CREATE_STEP) => void;

  selectedToken: CurrencyLike;
  setSelectedToken: (token: CurrencyLike) => void;

  deposit: number;
  setDeposit: (num: number) => void;

  generate: number;
  setGenerate: (num: number) => void;
}

export const createProviderContext = createContext<ProviderData>({} as ProviderData);

type Props = BareProps;

export const CreateProvider: FC<Props> = ({
  children
}) => {
  const [step, _setStep] = useState<CREATE_STEP>('select');
  const [selectedToken, _setSelectedToken] = useState<CurrencyLike>('');
  const [deposit, setDeposit] = useState<number>(0);
  const [generate, setGenerate] = useState<number>(0);

  const setStep = useCallback((step: CREATE_STEP) => {
    _setStep(step);
  }, [_setStep]);

  const setSelectedToken = useCallback((token: CurrencyLike) => {
    _setSelectedToken(token);
  }, [_setSelectedToken]);

  return (
    <createProviderContext.Provider
      value={{
        deposit,
        generate,
        selectedToken,
        setDeposit,
        setGenerate,
        setSelectedToken,
        setStep,
        step
      }}
    >
      {children}
    </createProviderContext.Provider>
  );
};
