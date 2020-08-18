import React, { memo, useCallback } from 'react';
import { Dialog } from '@acala-dapp/ui-components';
import { useSetting } from '@acala-dapp/react-hooks';

const POLKADOT_EXTENSIONS_CHROME = 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';
const POLKADOT_EXTENSIONS_FIREFOX = 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension';

export const NoExtensions: React.FC = memo(() => {
  const { browser } = useSetting();

  const handleGetExtensionBtnClick = useCallback((): void => {
    if (browser === 'firefox') {
      window.open(POLKADOT_EXTENSIONS_FIREFOX);

      return;
    }

    window.open(POLKADOT_EXTENSIONS_CHROME);
  }, [browser]);

  return (
    <Dialog
      cancelText={undefined}
      confirmText='GET IT'
      onConfirm={handleGetExtensionBtnClick}
      title={null}
      visiable={true}
    >
      <p>{'No polkadot{.js} extension found, please install it first!'}</p>
    </Dialog>
  );
});

NoExtensions.displayName = 'NoExtensions';
