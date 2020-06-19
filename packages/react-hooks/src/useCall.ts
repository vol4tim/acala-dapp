import { useEffect, useContext, useMemo } from 'react';
import { get } from 'lodash';
import { ApiRx } from '@polkadot/api';

import { globalStoreContext } from '@acala-dapp/react-environment';

import { useIsAppReady } from './useIsAppReady';
import { useApi } from './useApi';
import { CallParams } from './types';
import { Observable } from 'rxjs';

class Tracker {
  private trackerList: {[k in string]: { refCount: number; subscriber: Observable<unknown> }}

  constructor () {
    this.trackerList = {};
  }

  subscribe (api: ApiRx, path: string, params: CallParams, key: string, updateFn: (key: string, valeu: any) => void): void {
    if (!api || !path) {
      return;
    }

    if (this.trackerList[key]) {
      this.trackerList[key].refCount += 1;

      return;
    }

    const fn = get(api, path);

    if (!fn) {
      return;
    }

    const subscriber = fn(...params).subscribe({
      next: (result: any) => {
        updateFn(key, result);
      }
    });

    this.trackerList[key] = {
      refCount: 1,
      subscriber
    };
  }

  unsubscribe (key: string): void {
    if (this.trackerList[key]) {
      this.trackerList[key].refCount -= 1;
    }
  }
}

const tracker = new Tracker();

export function useCall <T> (path: string, params: CallParams = []): T | undefined {
  const { api } = useApi();
  const { appReadyStatus } = useIsAppReady();
  const { setStore, store } = useContext(globalStoreContext);
  const key = useMemo(() => `${path}${params.toString() ? '-' + params.toString() : ''}`, [path, params]);

  // on changes, re-subscribe
  useEffect(() => {
    // check if we have a function & that we are mounted
    if (appReadyStatus) {
      tracker.subscribe(api, path, params, key, setStore);
    }

    return (): void => {
      tracker.unsubscribe(key);
    };
  }, [appReadyStatus, api, path, params, key, setStore]);

  return store[key];
}
