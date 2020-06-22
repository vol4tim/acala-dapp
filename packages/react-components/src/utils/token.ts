import { CurrencyLike } from '@acala-dapp/react-hooks/types';

import AcaIcon from '../assets/coins-icon/ACA.svg';
import AUSDIcon from '../assets/coins-icon/aUSD.svg';
import BtcIcon from '../assets/coins-icon/BTC.svg';
import DotIcon from '../assets/coins-icon/DOT.svg';
import LDotIcon from '../assets/coins-icon/LDOT.svg';

export const ICON_IMAGES = {
  aca: AcaIcon,
  ausd: AUSDIcon,
  dot: DotIcon,
  ldot: LDotIcon,
  xbtc: BtcIcon
};

export const ICON_FULLNAMES = {
  aca: 'Acala',
  ausd: 'Acala Dollar',
  dot: 'Polkadot',
  ldot: 'Liquid DOT',
  xbtc: 'Interchain Bitcoin'
};

export const TOKEN_COLOR_MAP: Map<string, string> = new Map([
  ['BTC', '#F7931A'],
  ['LDOT', '#00F893'],
  ['DOT', '#e6007a']
]);

export function getTokenColor (token: CurrencyLike): string {
  // default color is black
  return TOKEN_COLOR_MAP.get(token.toString()) || '#000000';
}

export function getTokenImage (token: CurrencyLike): string {
  return Reflect.get(ICON_IMAGES, token.toString().toLowerCase()) || '';
}

export function getTokenFullName (token: CurrencyLike): string {
  return Reflect.get(ICON_FULLNAMES, token.toString().toLowerCase());
}

export function getTokenName (token: CurrencyLike, upper = true): string {
  if (!token) {
    return '';
  }

  const _name = token.toString();

  if (_name.toUpperCase() === 'AUSD') {
    return upper ? 'aUSD' : 'ausd';
  }

  return upper ? _name.toUpperCase() : _name.toLowerCase();
}
