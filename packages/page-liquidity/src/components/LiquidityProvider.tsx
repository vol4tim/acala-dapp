import React, { createContext, FC, useState, Dispatch, SetStateAction } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { TokenPair } from '@acala-network/sdk-core';

import { useLPCurrencies, useLPEnabledCurrencies, useEnableLPs } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';

type ActiveTabs = 'deposit' | 'widthdraw';

interface LiquidityContextData {
  activeTabs: ActiveTabs;
  enableLPs: TokenPair[];
  setActiveTabs: Dispatch<SetStateAction<ActiveTabs>>;
  lpCurrencies: CurrencyId[];
  lpEnableCurrencies: CurrencyId[];
}

export const LiquidityContext = createContext<LiquidityContextData>({} as LiquidityContextData);

export const LiquidityProvider: FC<BareProps> = ({ children }) => {
  const [activeTabs, setActiveTabs] = useState<ActiveTabs>('deposit');
  const lpCurrencies = useLPCurrencies();
  const lpEnableCurrencies = useLPEnabledCurrencies();
  const enableLPs = useEnableLPs();

  return (
    <LiquidityContext.Provider value={{
      activeTabs,
      enableLPs,
      lpCurrencies,
      lpEnableCurrencies,
      setActiveTabs
    }}>
      {children}
    </LiquidityContext.Provider>
  );
};
