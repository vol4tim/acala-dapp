import React, { FC, memo, useCallback, useState } from 'react';
import { Card } from '@acala-dapp/ui-components';
import { TxButton, formatBalance } from '@acala-dapp/react-components';
import { useAccounts, useCall } from '@acala-dapp/react-hooks';
import { BalanceWrapper } from '@acala-network/types/interfaces';

export const WithdrawUnbonded: FC = memo(() => {
  const { active } = useAccounts();
  const [_refresh, setRefresh] = useState<number>(0);
  const result = useCall<BalanceWrapper>('rpc.stakingPool.getAvailableUnbonded', [active ? active.address : '']);

  const handleSuccess = useCallback(() => {
    setRefresh(_refresh + 1);
  }, [_refresh]);

  if (!result) {
    return null;
  }

  return (
    <Card>
      <p>
        {`You have ${formatBalance(result.amount)} can withdraw`}
      </p>
      {
        !result.amount.isEmpty && (
          <TxButton
            method='withdrawRedemption'
            onInblock={handleSuccess}
            params={[]}
            section='homa'
          >
            Withdraw
          </TxButton>
        )
      }
    </Card>
  );
});

WithdrawUnbonded.displayName = 'WithdrawUnbonded';
