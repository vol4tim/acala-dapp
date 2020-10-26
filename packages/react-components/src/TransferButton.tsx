import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces/types';
import { Button } from '@acala-dapp/ui-components';
import { useModal } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';
import { TransferModal } from './TransferModal';

interface Props extends BareProps {
  mode: 'token' | 'lp-token';
  currency: CurrencyId;
}

export const TransferButton: FC<Props> = memo(({
  children,
  className,
  currency,
  mode
}) => {
  const { close, status, toggle } = useModal();

  return (
    <>
      <Button
        className={className}
        onClick={toggle}
        size='small'
      >
        {children || 'Transfer'}
      </Button>
      <TransferModal
        defaultCurrency={currency}
        mode={mode}
        onClose={close}
        visiable={status}
      />
    </>
  );
});

TransferButton.displayName = 'TransferButton';
