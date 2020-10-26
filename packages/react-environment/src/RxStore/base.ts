import { Subscription } from 'rxjs';
import { ApiRx } from '@polkadot/api';
import { AnyFunction } from '@polkadot/types/types';

export abstract class BaseRxStore {
  protected isInitialized!: boolean;

  unsubscribe (subscribe: Subscription): void {
    subscribe.unsubscribe();
  }

  abstract run(): void;

  abstract init(api: ApiRx, p1?: any): void

  abstract init(api: ApiRx, p1?: any, p2?: any): void

  abstract init(api: ApiRx, p1?: any, p2?: any, p3?: any): void

  abstract subscribe(p1: any, callback: AnyFunction): Subscription;
  abstract subscribe(p1: any, p2: any, callback: AnyFunction): Subscription;
  abstract subscribe(p1: any, p2: any, p3: any, callback: AnyFunction): Subscription;
}
