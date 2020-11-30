import React, { FC, useMemo } from 'react';

import { TokenInfoOf, ClassInfoOf } from '@acala-network/types/interfaces';
import { Card, GridBox, Empty, CardLoading } from '@acala-dapp/ui-components';
import { NFTCard } from '@acala-dapp/react-components';
import { useAllNFTTokens } from '@acala-dapp/react-hooks';

type NewTokenInfo = Omit<TokenInfoOf, 'metadata'> & { metadata: Record<string, string> };

export const NFT: FC = () => {
  const { data, loading } = useAllNFTTokens();

  const _data = useMemo(() => {
    if (loading) return [];

    return data.map(([classes, token]) => {
      try {
        JSON.parse(token.metadata.toUtf8());

        return [classes, token];
      } catch (e) {
        // swallow error
      }

      return null;
    /* eslint-disable-next-line */
    }).filter((result) => {
      return !!result;
    }).map((data) => {
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      const [classes, token] = data! as [ClassInfoOf, TokenInfoOf];

      const metadata = JSON.parse(token.metadata.toUtf8());

      return {
        artist: metadata?.artist,
        classes: {
          metadata: classes.metadata.toUtf8(),
          totalIssuance: classes.totalIssuance.toBn().toNumber()
        },
        externalUrl: metadata?.external_url,
        name: metadata?.name,
        publisher: metadata?.publisher
      };
    });
  }, [data, loading]);

  if (loading) return <CardLoading />;

  if (!_data.length && !loading) return <Empty title='No NFT' />;

  return (
    <Card showShadow={false}>
      <GridBox
        column={3}
        padding={32}
        row={'auto'}
      >
        {
          _data.map((data, index): JSX.Element => {
            return (
              <div key={`nft-${data.classes.metadata}-${data.name}-${index}`}>
                <NFTCard
                  artist={data.artist}
                  externalUrl={data.externalUrl}
                  name={data.name}
                  publisher={data.publisher}
                />
              </div>
            );
          })
        }
      </GridBox>
    </Card>
  );
};
