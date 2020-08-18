import React, { FC, PropsWithChildren, useState } from 'react';
import { switchMap, map, timeout, finalize, take } from 'rxjs/operators';

import { SubmittableResult, ApiRx } from '@polkadot/api';
import { ITuple } from '@polkadot/types/types';
import { DispatchError, AccountInfo } from '@polkadot/types/interfaces';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { useAccounts, useApi, useHistory } from '@acala-dapp/react-hooks';
import { Button, ButtonProps, notification, LoadingOutlined } from '@acala-dapp/ui-components';

import { FormatAddress } from './format';

interface Props extends ButtonProps {
  section: string;
  method: string;
  params: any[];
  beforSend?: () => void;
  onSuccess?: () => void;
  onFailed?: () => void;
  onFinally?: () => void;
  addon?: any;
}

const MAX_TX_DURATION_TIME = 60 * 1000;

function extractEvents (api: ApiRx, result: SubmittableResult): void {
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

        notification.error({
          description: message,
          message: 'some error occur'
        });
      } else {
        notification.info({
          message: `${section}.${method}`
        });
      }
    });
}

export const TxButton: FC<PropsWithChildren<Props>> = ({
  beforSend,
  children,
  className,
  disabled,
  method,
  onFailed,
  onFinally,
  onSuccess,
  params,
  section,
  size,
  ...other
}) => {
  const { api } = useApi();
  const { active, authRequired, setAuthRequired } = useAccounts();
  const [isSending, setIsSending] = useState<boolean>(false);
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

      if (!authRequired) {
        setAuthRequired(true);
      }

      return;
    }

    if (beforSend) {
      beforSend();
    }

    // lock btn click
    setIsSending(true);

    let notificationKey = '';

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

        notificationKey = `${section}-${method}`;
        signedTx.paymentInfo(active.address).subscribe((result) => console.log(result.toString()));

        notification.info({
          description: <FormatAddress address={hash} />,
          duration: null,
          icon: <LoadingOutlined spin />,
          key: notificationKey,
          message: `${section}: ${method}`
        });

        return signedTx.send().pipe(timeout(MAX_TX_DURATION_TIME));
      }),
      map((result): boolean => {
        if (
          result.status.isInBlock ||
          result.status.isFinalized
        ) {
          extractEvents(api, result as unknown as SubmittableResult);

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
        if (error.name === 'TimeoutError') {
          notification.error({
            duration: 4,
            key: notificationKey,
            message: 'Extrinsic timed out, Please check manually'
          });
        } else {
          notification.error({
            duration: 4,
            key: notificationKey,
            message: (error && error.message) ? error.message : 'Unknown Error Occurred!'
          });
        }

        _onFailed();
        setIsSending(false);
        subscriber.unsubscribe();
      },
      next: (isDone) => {
        if (isDone) {
          notification.success({
            duration: 4,
            key: notificationKey,
            message: 'Submit Transaction Success'
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
      {...other}
    >
      {children}
    </Button>
  );
};
