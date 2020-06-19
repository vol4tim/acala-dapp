import React, { createContext, FC, PropsWithChildren, useMemo } from 'react';
import { isEmpty } from 'lodash';
import { useLockPrices, LockedPricesResult } from '@acala-dapp/react-hooks/useLockPrices';
import { useEmergencyShutdown } from '@acala-dapp/react-hooks';

export type EmergencyShutdownStep = 'lock_price' | 'process_debit' | 'waiting_for_refund' | 'refund';

export interface EmergencyShutdownContextData {
  step: EmergencyShutdownStep;
  lockedPrices: LockedPricesResult;
}

export const EmergencyShutdownContext = createContext<EmergencyShutdownContextData>({} as EmergencyShutdownContextData);

export const EmergencyShutdownProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const lockedPrices = useLockPrices();
  const { canRefund } = useEmergencyShutdown();
  const step = useMemo<EmergencyShutdownStep>(() => {
    if (isEmpty(lockedPrices)) {
      return 'lock_price';
    }

    if (canRefund) {
      return 'refund';
    }

    return 'waiting_for_refund';
  }, [canRefund, lockedPrices]);

  return (
    <EmergencyShutdownContext.Provider value={{ lockedPrices, step }}>
      {children}
    </EmergencyShutdownContext.Provider>
  );
};
