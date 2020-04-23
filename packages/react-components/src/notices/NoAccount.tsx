import React, { FC, memo } from 'react';
import { Dialog } from '@honzon-platform/ui-components';

export const NoAccount: FC = memo(() => {
  const handleRetry = (): void => window.location.reload();

  return (
    <Dialog
      cancelText={undefined}
      confirmText='Retry'
      onConfirm={handleRetry}
      title={null}
      visiable={true}
    >
      <p>
        No account found, please add account in your wallet extension or unlock it!
      </p>
    </Dialog>
  );
});

NoAccount.displayName = 'NoAccount';
