import React, { FC, useEffect } from 'react';
import { isEmpty } from 'lodash';

import { Vec } from '@polkadot/types';
import { EventRecord } from '@polkadot/types/interfaces';

import { useApi, useAccounts } from '@acala-dapp/react-hooks';
import { notification } from '@acala-dapp/ui-components';
import { Fixed18 } from '@acala-network/app-util';
import { getTokenName, formatHash } from './utils';

interface HandlerConfig {
  section: string;
  method: string;
  handler: (item: EventRecord) => void;
}

type HandlerConfigHashMap = {
  [k in string]: HandlerConfig['handler'];
}

function handler (config: HandlerConfig[]): (list: EventRecord[]) => void {
  const dispatcherHashMap: HandlerConfigHashMap = config.reduce((hashMap, item) => {
    hashMap[`${item.section}_${item.method}`] = item.handler;

    return hashMap;
  }, {} as HandlerConfigHashMap);

  return (list: EventRecord[]): void => {
    list.forEach((item) => {
      const key = `${item.event.section.toString()}_${item.event.method.toString()}`;
      const handler = dispatcherHashMap[key];

      if (handler) {
        handler(item);
      }
    });
  };
}

export const EventsWatcher: FC = () => {
  const { api } = useApi();
  const { active } = useAccounts();

  useEffect(() => {
    if (isEmpty(api) || !active) {
      return;
    }

    const subscriber = api.query.system.events<Vec<EventRecord>>().subscribe({
      next: (events: Vec<EventRecord>): void => {
        handler([
          {
            handler: (event): void => {
              const data = event.event.data.toJSON() as unknown as string[]; // [ASSET, ORIGIN, TARGET, AMOUNT]

              if (data[2] !== active?.address) return;

              notification.success({
                message: (
                  <div>
                    <p>{`Received ${Fixed18.fromParts(Number(data[3])).toString(2, 3)} ${getTokenName(data[0])}`}</p>
                    <p>{`From ${formatHash(data[1])}`}</p>
                  </div>
                )
              });
            },
            method: 'Transferred',
            section: 'currencies'
          }
        ])(events);
      }
    });

    return (): void => subscriber.unsubscribe();
  }, [api, active]);

  return <></>;
};
