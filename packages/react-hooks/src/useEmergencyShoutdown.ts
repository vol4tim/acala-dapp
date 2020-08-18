import Bool from '@polkadot/types/primitive/Bool';

import { useCall } from './useCall';

interface EmergencyShutdownData {
  canRefund: boolean;
  isShutdown: boolean;
}

export function useEmergencyShutdown (): EmergencyShutdownData {
  const _isShutdown = useCall<Bool>('query.emergencyShutdown.isShutdown', []);
  const _canRefund = useCall<Bool>('query.emergencyShutdown.canRefund', []);

  return {
    canRefund: _canRefund ? _canRefund.isTrue : false,
    isShutdown: _isShutdown ? _isShutdown.isTrue : false
  };
}
