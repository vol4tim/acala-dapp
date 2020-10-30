import React, { FC } from 'react';
import { useAllNFTTokens } from '@acala-dapp/react-hooks';

export const AcalaTestNet: FC = () => {
  const nfts = useAllNFTTokens('0');

  console.log(nfts);

  return (
    <div>hello</div>
  );
};
