import { Vec } from '@polkadot/types';
import { AccountId } from '@acala-network/types/interfaces/types';

import { useCall } from './useCall';

export const useCouncilMembers = (council: string): Vec<AccountId> | undefined => {
  const members = useCall<Vec<AccountId>>(`query.${council}Council.members`, []);

  return members;
};
