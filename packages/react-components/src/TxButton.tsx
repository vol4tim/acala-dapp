import React, { FC, PropsWithChildren, useState } from 'react';
import { switchMap, map, timeout, finalize, take } from 'rxjs/operators';

import { SubmittableResult, ApiRx } from '@polkadot/api';
import { ITuple } from '@polkadot/types/types';
import { DispatchError, AccountInfo } from '@polkadot/types/interfaces';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { useAccounts, useApi, useNotification, useHistory } from '@acala-dapp/react-hooks';
import { Button, ButtonProps } from '@acala-dapp/ui-components';
import { CreateNotification } from '@acala-dapp/ui-components/Notification/context';
import { NotificationConfig } from '@acala-dapp/ui-components/Notification/types';

import { FormatAddress } from './format';

interface Props extends ButtonProps {
  section: string;
  method: string;
  params: any[];
  onSuccess?: () => void;
  onFailed?: () => void;
  onFinally?: () => void;
  addon?: any;
}

const MAX_TX_DURATION_TIME = 60 * 1000;

function extractEvents (api: ApiRx, result: SubmittableResult, createNotification: CreateNotification): void {
  if (!result || !result.events) {
    return;
  }

  result
    .events
    .filter((event): boolean => !!event.event)
    .map(({ event: { data, method, section } }): void => {
      if (section === 'system' && method === 'ExtrinsicFailed') {
        const [dispatchError] = data as unknown as ITuple<[DispatchError]>;
        let message = dispatchError.type;

        if (dispatchError.isModule) {
          try {
            const mod = dispatchError.asModule;
            const error = api.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

            message = `${error.section}.${error.name}`;
          } catch (error) {
            // swallow error
          }
        }

        createNotification({
          content: message,
          icon: 'error',
          removedDelay: 4000,
          title: `${section}.${method}`,
          type: 'error'
        });
      } else {
        createNotification({
          removedDelay: 4000,
          title: `${section}.${method}`,
          type: 'info'
        });
      }
    });
}

export const TxButton: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  disabled,
  method,
  onFailed,
  onFinally,
  onSuccess,
  params,
  section,
  size
}) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const [isSending, setIsSending] = useState<boolean>(false);
  const { createNotification } = useNotification();
  const { refresh } = useHistory();

  const _onFailed = (): void => {
    onFailed && onFailed();
  };

  const _onSuccess = (): void => {
    onSuccess && onSuccess();
  };

  const _onFinally = (): void => {
    setIsSending(false);
    refresh(2000);
    onFinally && onFinally();
  };

  const onClick = (): void => {
    if (!api.tx[section] || !api.tx[section][method]) {
      console.error(`can not find api.tx.${section}.${method}`);

      return;
    }

    if (!(active && active.address)) {
      console.error('can not find available address');

      return;
    }

    // lock btn click
    setIsSending(true);

    let notification: NotificationConfig = {} as NotificationConfig;

    // try {
    const subscriber = api.query.system.account<AccountInfo>(active.address).pipe(
      switchMap((account) => {
        return api.tx[section][method](...params).signAsync(
          active.address,
          {
            nonce: account.nonce.toNumber()
          }
        );
      }),
      take(1),
      switchMap((signedTx: SubmittableExtrinsic<'rxjs'>) => {
        const hash = signedTx.hash.toString();

        notification = createNotification({
          content: <FormatAddress address={hash} />,
          icon: 'loading',
          title: `${section}: ${method}`,
          type: 'info'
        });

        return signedTx.send().pipe(timeout(MAX_TX_DURATION_TIME));
      }),
      map((result): boolean => {
        if (
          result.status.isInBlock ||
          result.status.isFinalized
        ) {
          extractEvents(api, result as unknown as SubmittableResult, createNotification);

          return true;
        }

        if (
          result.status.isUsurped ||
          result.status.isDropped ||
          result.status.isFinalityTimeout
        ) {
          throw new Error(result.status.toString());
        }

        return false;
      }),
      finalize(() => {
        _onFinally();
      })
    ).subscribe({
      error: (error: Error) => {
        let config = {};

        if (error.name === 'TimeoutError') {
          config = {
            icon: 'info',
            removedDelay: 4000,
            title: 'Extrinsic timed out, Please check manually',
            type: 'info'
          };
        } else {
          config = {
            icon: 'error',
            removedDelay: 4000,
            type: 'error'
          };
        }

        if (Reflect.has(notification, 'update')) {
          notification.update(config);
        }

        _onFailed();
        setIsSending(false);
        subscriber.unsubscribe();
      },
      next: (isDone) => {
        if (isDone) {
          notification.update({
            icon: 'success',
            removedDelay: 4000,
            type: 'success'
          });
          _onSuccess();
          setIsSending(false);
          subscriber.unsubscribe();
        }
      }
    });
  };

  return (
    <Button
      className={className}
      color='primary'
      disabled={disabled || isSending}
      loading={isSending}
      onClick={onClick}
      size={size}
    >
      {children}
    </Button>
  );
};
