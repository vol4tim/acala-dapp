import { useMemo } from 'react';
import { TokenId, TokenInfoOf, CID } from '@acala-network/types/interfaces';

import { useAccounts } from './useAccounts';
import { useCall } from './useCall';

interface TokenData {
  tokenId: TokenId;
  data: TokenInfoOf;
}

export const useAllNFTTokens = (cid: CID | string): TokenData[] => {
  const { active } = useAccounts();
  const data = useCall<TokenData[]>('derive.nft.queryTokensByAccount', [active?.address || '', cid]);

  const result = useMemo<TokenData[]>(() => {
    return data || [];
  }, [data]);

  return result;
};
