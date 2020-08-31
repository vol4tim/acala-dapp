import React, { FC, useEffect, useRef } from 'react';
import { uniqueId } from 'lodash';
import { notification } from '@acala-dapp/ui-components';
import { useApi } from '@acala-dapp/react-hooks';

let globalDisplayedLock = false;

export const ConnectError: FC = () => {
  const { connected, error } = useApi();
  const messageKey = useRef<string>(uniqueId());

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

    if (connected && !globalDisplayedLock) {
      globalDisplayedLock = true;
      notification.success({
        ...baseConfig,
        duration: 2,
        message: 'Connect Success'
      });
    }
  }, [error, connected]);

  return null;
};
