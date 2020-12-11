import { useApi, useIsAppReady } from '@acala-dapp/react-hooks';
import { options } from '@acala-network/api';
import { web3Enable } from '@polkadot/extension-dapp';
import { InjectedMetadata, InjectedMetadataKnown, MetadataDef } from '@polkadot/extension-inject/types';
import { isNumber } from '@polkadot/util';
import React, { FC, memo, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import classes from './UploadMetadata.module.scss';

export const UploadMetadata: FC = memo(() => {
  const { api } = useApi();
  const { appReadyStatus } = useIsAppReady();
  const [triggerSignal, triggerUpdate] = useReducer((c) => c + 1, 0);
  const [metadata, setMetadata] = useState<InjectedMetadata | undefined>();
  const [metadataDef, setMetadataDef] = useState<MetadataDef | undefined>();
  const [known, setKnown] = useState<InjectedMetadataKnown[] | undefined>();

  const loadWeb3Metadata = useCallback(async () => {
    if (!appReadyStatus) return;

    try {
      const extensions = await web3Enable('Acala Dapp');
      const extension = extensions[0];
      const metadata = extension.metadata;
      const known = await metadata?.get();

      setMetadata(metadata);

      setKnown(known);

      setMetadataDef({
        chain: (api as any)._runtimeChain.toString(),
        genesisHash: api.genesisHash.toHex(),
        icon: 'substrate',
        metaCalls: Buffer.from(api.runtimeMetadata.asCallsOnly.toU8a()).toString('base64'),
        specVersion: api.runtimeVersion.specVersion.toNumber(),
        ss58Format: isNumber(api.registry.chainSS58) ? api.registry.chainSS58 : 42,
        tokenDecimals: isNumber(api.registry.chainDecimals) ? api.registry.chainDecimals : 12,
        tokenSymbol: api.registry.chainToken || 'Unit',
        types: options({}).types as any
      });
    } catch (error) {
      console.error(error);
    }
  }, [api, appReadyStatus]);

  const checkUploaded = useMemo(() => {
    if (known && metadataDef) {
      return !known.find(
        ({ genesisHash, specVersion }) =>
          metadataDef.genesisHash === genesisHash && metadataDef.specVersion === specVersion
      );
    } else {
      return false;
    }
  }, [known, metadataDef]);

  const uploadMetadata = useCallback(async () => {
    if (metadataDef && metadata?.provide) {
      await metadata.provide(metadataDef);
      triggerUpdate();
    }
  }, [metadata, metadataDef]);

  useEffect(() => {
    loadWeb3Metadata();
  }, [loadWeb3Metadata, triggerSignal]);

  if (!checkUploaded) return null;

  return (
    <div
      className={classes.root}
      onClick={uploadMetadata}
    >
      Upload Metadata
    </div>
  );
});

UploadMetadata.displayName = 'UploadMetadata';
