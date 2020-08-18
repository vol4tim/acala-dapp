import { FC, memo, useEffect, useRef } from 'react';
import { notification } from '@acala-dapp/ui-components';
import { useApi } from '@acala-dapp/react-hooks';
import { uniqueId } from 'lodash';

export const ConnectError: FC = memo(() => {
  const { error } = useApi();
  const messageKey = useRef<string>(uniqueId());

  useEffect(() => {
    const message = {
      btn: null,
      closeIcon: null,
      duration: null,
      key: messageKey.current,
      message: 'Connect Error',
      placement: 'topRight' as any
    };

    if (error) {
      notification.error({ ...message });
    } else {
      notification.success({
        ...message,
        duration: 2,
        message: 'Connect Success'
      });
    }
  }, [error]);

  return null;
});

ConnectError.displayName = 'ConnectError';
