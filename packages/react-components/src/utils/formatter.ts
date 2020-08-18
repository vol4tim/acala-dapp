import { Codec } from '@polkadot/types/types';
import { Fixed18 } from '@acala-network/app-util';

export const LAMINAR_WATCHER_ADDRESS = '5CLaminarAUSDCrossChainTransferxxxxxxxxxxxxxwisu';

export const LAMINAR_SENDER_ADDRESS = '5DiKSJG59azdU8YkmYcPxSg2BNfXgph4dcJVKEn5vibyN6iK';

export const FAUCET_ADDRESS = '5DZbNKzPgAnpb5LYfafPx4P3JMeyn1kxyeSJNuoCKddxEbXc';

export const thousand = (num: string | string): string => {
  const _num = num.toString();
  const reg = /(?!\b)(?=(\d{3})+\b)/g;

  return _num.replace(reg, ',');
};

export interface FormatNumberConfig {
  decimalLength: number;
  removeTailZero: boolean;
  removeEmptyDecimalParts: boolean;
}

export const formatNumber = (num: string | number | Fixed18 | undefined, config: FormatNumberConfig = { decimalLength: 6, removeEmptyDecimalParts: true, removeTailZero: true }): string => {
  const _num: string = num ? (num instanceof Fixed18) ? num.toFixed(18, 2) : Fixed18.fromNatural(num).toFixed(18, 2) : '0';

  let [i, d] = _num.split('.');

  if (config.decimalLength) {
    d = (d || '').slice(0, config.decimalLength).padEnd(config.decimalLength, '0');
  }

  if (d && config.removeTailZero) {
    d = d.replace(/(\d*?)0*$/, '$1');
  }

  if (d && config.removeEmptyDecimalParts) {
    if (/^0*$/.test(d)) {
      return thousand(i);
    }
  }

  if (!d) {
    return thousand(i);
  }

  return [thousand(i), d].join('.');
};

export const formatHash = (hash: string, name = true): string => {
  if (name) {
    if (hash === LAMINAR_WATCHER_ADDRESS || hash === LAMINAR_SENDER_ADDRESS) {
      return 'Laminar';
    }

    if (hash === FAUCET_ADDRESS) {
      return 'Faucet';
    }
  }

  return hash.replace(/(\w{6})\w*?(\w{6}$)/, '$1......$2');
};

export const formatAddress = (address: string, isMini?: boolean): string => {
  if (address === LAMINAR_WATCHER_ADDRESS || address === LAMINAR_SENDER_ADDRESS) {
    return 'Laminar';
  }

  if (address === FAUCET_ADDRESS) {
    return 'Faucet';
  }

  return !isMini
    ? address.replace(/(\w{6})\w*?(\w{6}$)/, '$1......$2')
    : address.replace(/(\w{6})\w*$/, '$1...');
};

export const formatBalance = (balance: Fixed18 | Codec | number | string | undefined): Fixed18 => {
  let inner = Fixed18.ZERO;

  if (!balance) {
    return Fixed18.ZERO;
  }

  if (typeof balance === 'number' || typeof balance === 'string') {
    return Fixed18.fromNatural(balance);
  }

  if (balance instanceof Fixed18) {
    return balance;
  }

  // for Codec
  inner = Fixed18.fromParts(balance.toString());

  return inner;
};

export const formatDuration = (duration: number): number => {
  const DAY = 1000 * 60 * 60 * 24;

  return Fixed18.fromRational(duration, DAY).toNumber(6, 2);
};
