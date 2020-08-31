import React, { FC, memo, useEffect, useRef } from 'react';
import { notification } from '@acala-dapp/ui-components';
import { useApi } from '@acala-dapp/react-hooks';
import { uniqueId } from 'lodash';

export const ConnectError: FC = memo(() => {
  const { connected, error } = useApi();
  const messageKey = useRef<string>(uniqueId());
  const isDone = useRef<boolean>(false);

  useEffect(() => {
    const baseConfig = {
      closeIcon: <p/>, // hack for hide close icon
      key: messageKey.current,
      message: 'Connect Error',
      placement: 'topRight' as any
    };

    if (error) {
      notification.error({ ...baseConfig });

      return;
    }

    if (connected && !isDone.current) {
      notification.success({
        ...baseConfig,
        duration: 2,
        message: 'Connect Success'
      });
      isDone.current = true;
    }
  }, [error, connected]);

  return null;
});

ConnectError.displayName = 'ConnectError';
