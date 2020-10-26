import React, { createContext, FC, useState, Dispatch, SetStateAction } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { TokenPair } from '@acala-network/sdk-core';

import { useLPCurrencies, useLPEnabledCurrencies, useEnableLPs } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';

type ActiveTabs = 'honzon-incentives' | 'dex-incentives' | 'dex-saving' | 'homa-incentives';

interface IncentivesContextData {
  activeTabs: ActiveTabs;
  enableLPs: TokenPair[];
  setActiveTabs: Dispatch<SetStateAction<ActiveTabs>>;
  lpCurrencies: CurrencyId[];
  lpEnableCurrencies: CurrencyId[];
}

export const IncentivesContext = createContext<IncentivesContextData>({} as IncentivesContextData);

export const IncentivesProvider: FC<BareProps> = ({ children }) => {
  const [activeTabs, setActiveTabs] = useState<ActiveTabs>('honzon-incentives');
  const lpCurrencies = useLPCurrencies();
  const lpEnableCurrencies = useLPEnabledCurrencies();
  const enableLPs = useEnableLPs();

  return (
    <IncentivesContext.Provider value={{
      activeTabs,
      enableLPs,
      lpCurrencies,
      lpEnableCurrencies,
      setActiveTabs
    }}>
      {children}
    </IncentivesContext.Provider>
  );
};
