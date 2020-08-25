import React, { FC, PropsWithChildren, useState, useCallback } from 'react';
import { isFunction, uniqueId } from 'lodash';
import { Observable, of } from 'rxjs';
import { switchMap, map, timeout, finalize, take, catchError } from 'rxjs/operators';

import { SubmittableResult } from '@polkadot/api';
import { ITuple, ISubmittableResult } from '@polkadot/types/types';
import { DispatchError, AccountInfo } from '@polkadot/types/interfaces';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { useAccounts, useApi, useHistory, useAllBalances } from '@acala-dapp/react-hooks';
import { Button, ButtonProps, notification, LoadingOutlined } from '@acala-dapp/ui-components';

import { FormatAddress } from './format';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

interface Props extends ButtonProps {
  affectAssets?: CurrencyLike[]; // assets which be affected in this extrinsc
  section: string; // extrinsic section
  method: string; // extrinsic method
  params: any[] | (() => any[]); // extrinsic params

  beforeSend?: () => void; // the callback will be executed before send
  afterSend?: () => void; // the callback will be executed after send
  onInblock?: () => void; // the callback will be executed when extrinsic in block
  onFinalize?: () => void; // the callback will be executed when extrinsic in finalize
  onExtrinsicSuccess?: () => void; // the callback will be executed when extrinsic success
  onFailed?: () => void; // the callback will be executed when extrinsic failed
}

const MAX_TX_DURATION_TIME = 60 * 1000;

export const TxButton: FC<PropsWithChildren<Props>> = ({
  afterSend,
  beforeSend,
  children,
  className,
  disabled,
  method,
  onExtrinsicSuccess,
  onFailed,
  onFinalize,
  onInblock,
  params,
  section,
  size,
  ...other
}) => {
  const { api } = useApi();
  const { active, authRequired, setAuthRequired } = useAccounts();
  const [isSending, setIsSending] = useState<boolean>(false);
  const { refresh } = useHistory();
  const allBalances = useAllBalances();

  const onClick = useCallback((): void => {
    // ensure that the section and method are exist
    if (!api.tx[section] || !api.tx[section][method]) {
      console.error(`can not find api.tx.${section}.${method}`);

      return;
    }

    // ensuer that account is exist
    if (!(active && active.address)) {
      console.error('can not find available address');

      if (!authRequired) {
        setAuthRequired(true);
      }

      return;
    }

    const createTx = (): Observable<SubmittableExtrinsic<'rxjs'>> => api.query.system.account<AccountInfo>(active.address).pipe(
      take(1),
      map((account) => {
        const _params = isFunction(params) ? params() : params;

        return [account, _params] as [AccountInfo, any[]];
      }),
      switchMap(([account, params]) => {
        const signedExtrinsic = api.tx[section][method](...params);

        return signedExtrinsic.paymentInfo(active.address).pipe(
          map((result) => {
            console.log(result.toString());
          }),
          map(() => [account, params]),
          catchError((error) => {
            console.log(error);

            return of([account, params]);
          })
        );
      }),
      switchMap(([account, params]) => {
        console.log(account);

        return api.tx[section][method](...params).signAsync(
          active.address,
          { nonce: account.nonce.toNumber() }
        );
      })
    );

    const notify = (signedTx: SubmittableExtrinsic<'rxjs'>): [SubmittableExtrinsic<'rxjs'>, string] => {
      const hash = signedTx.hash.toString();

      const notificationKey = uniqueId(`${section}-${method}`);

      notification.info({
        description: <FormatAddress address={hash} />,
        duration: null,
        icon: <LoadingOutlined spin />,
        key: notificationKey,
        message: `${section}: ${method}`
      });

      return [signedTx, notificationKey];
    };

    const send = (signedTx: SubmittableExtrinsic<'rxjs'>): Observable<ISubmittableResult> => {
      return signedTx.send().pipe(timeout(MAX_TX_DURATION_TIME));
    };

    const extractEvents = (result: SubmittableResult): { isDone: boolean; errorMessage?: string } => {
      const events = result.events.filter((event): boolean => !!event.event);

      for (const { event: { data, method, section } } of events) {
        // extrinsic success
        if (section === 'system' && method === 'ExtrinsicSuccess') {
          return { isDone: true };
        }

        // extrinsic failed
        if (section === 'system' && method === 'ExtrinsicFailed') {
          const [dispatchError] = data as unknown as ITuple<[DispatchError]>;
          let message = dispatchError.type;

          if (dispatchError.isModule) {
            try {
              const mod = dispatchError.asModule;
              const error = api.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

              message = `${error.section}.${error.name}`;
            } catch (error) {
              message = Reflect.has(error, 'toString') ? error.toString() : error;
            }
          }

          return { errorMessage: message, isDone: true };
        }
      }

      return { isDone: false };
    };

    let notificationKey = '';

    // execute before send callback
    if (beforeSend) {
      beforeSend();
    }

    // lock btn click
    setIsSending(true);

    const subscriber = createTx().pipe(
      map(notify),
      switchMap(([signedTx, key]) => {
        notificationKey = key;

        return send(signedTx).pipe(
          map((sendResult): boolean => {
            if (sendResult.status.isInBlock && onInblock) {
              onInblock();
            }

            if (sendResult.status.isFinalized && onFinalize) {
              onFinalize();
            }

            if (
              sendResult.status.isInBlock ||
              sendResult.status.isFinalized
            ) {
              const { errorMessage, isDone } = extractEvents(sendResult);

              // handle extrinsic error
              if (isDone && errorMessage) {
                throw new Error(errorMessage);
              }

              return isDone;
            }

            if (
              sendResult.status.isUsurped ||
              sendResult.status.isDropped ||
              sendResult.status.isFinalityTimeout
            ) {
              throw new Error(sendResult.status.toString());
            }

            return false;
          })
        );
      }),
      // exculte afterSend callback
      finalize(() => {
        if (afterSend) {
          afterSend();
        }

        setIsSending(false);
        setTimeout(refresh, 2000);
      })
    ).subscribe({
      error: (error: Error) => {
        if (error.name === 'TimeoutError') {
          notification.error({
            duration: 4,
            key: notificationKey,
            message: 'Extrinsic timed out, Please check manually'
          });
        }

        notification.error({
          duration: 4,
          key: notificationKey,
          message: (error && error.message) ? error.message : 'Error Occurred!'
        });

        if (onFailed) {
          onFailed();
        }

        subscriber.unsubscribe();
      },
      next: (isDone) => {
        if (isDone) {
          if (onExtrinsicSuccess) {
            onExtrinsicSuccess();
          }

          notification.success({
            duration: 4,
            key: notificationKey,
            message: 'Submit Transaction Success'
          });

          subscriber.unsubscribe();
        }
      }
    });
  }, [active, afterSend, api.query.system, api.registry, api.tx, authRequired, beforeSend, method, params, section, setAuthRequired, onExtrinsicSuccess, onInblock, onFinalize, onFailed, refresh]);

  return (
    <Button
      className={className}
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
