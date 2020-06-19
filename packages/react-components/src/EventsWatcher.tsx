/* eslint-disable */
import React, { FC, useEffect } from 'react';
import { isEmpty } from 'lodash';

import { Vec } from '@polkadot/types';
import { EventRecord } from '@polkadot/types/interfaces';

import { useApi } from '@acala-dapp/react-hooks';

export const EventsWatcher: FC = () => {
  const { api } = useApi();

  useEffect(() => {
    if (isEmpty(api)) {
      return;
    }

    // api.query.system.events<Vec<EventRecord>>().subscribe({
    //   next: (events: Vec<EventRecord>): void => {
    //     console.log(events);
    //   }
    // });
  }, [api]);

  return <></>;
};
