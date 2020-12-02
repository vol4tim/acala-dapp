import React, { createContext, FC, useState, useRef, useCallback } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useEmergencyShutdown } from '@acala-dapp/react-hooks';

type LoanTab = 'overview' | 'create' | (CurrencyId | string);

interface LoanContextData {
  // for emergency shutdown
  isShutdown: boolean;
  canRefund: boolean;

  // for use loan select
  currentTab: LoanTab;
  setCurrentTab: (tab: LoanTab) => void;
  cancelCurrentTab: () => void;
  showOverview: () => void;
  showCreate: () => void;
}

export const LoanContext = createContext<LoanContextData>({} as LoanContextData);

export const LoanProvider: FC<BareProps> = ({
  children
}) => {
  const prevTabRef = useRef<LoanTab>('overview');
  const [currentTab, _setCurrentTab] = useState<LoanTab>('overview');
  const { canRefund, isShutdown } = useEmergencyShutdown();

  const setCurrentTab = useCallback((tab: LoanTab) => {
    prevTabRef.current = currentTab;
    _setCurrentTab(tab);
  }, [currentTab]);

  const showOverview = useCallback(() => {
    setCurrentTab('overview');
  }, [setCurrentTab]);

  const showCreate = useCallback(() => {
    prevTabRef.current = currentTab;
    setCurrentTab('create');
  }, [currentTab, setCurrentTab]);

  const cancelCurrentTab = useCallback(() => {
    setCurrentTab(prevTabRef.current);
  }, [setCurrentTab]);

  return (
    <LoanContext.Provider
      value={{
        canRefund,
        cancelCurrentTab,
        currentTab,
        isShutdown,
        setCurrentTab,
        showCreate,
        showOverview
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};
