import { CurrencyLike } from '@acala-dapp/react-hooks/types';

import AcaIcon from '../assets/coins-icon/ACA.svg';
import AUSDIcon from '../assets/coins-icon/aUSD.svg';
import BtcIcon from '../assets/coins-icon/BTC.svg';
import DotIcon from '../assets/coins-icon/DOT.svg';
import LDotIcon from '../assets/coins-icon/LDOT.svg';

const ICON_IMAGES = {
  aca: AcaIcon,
  ausd: AUSDIcon,
  dot: DotIcon,
  ldot: LDotIcon,
  xbtc: BtcIcon
};

const ICON_FULLNAMES = {
  aca: 'Acala',
  ausd: 'Acala Dollar',
  dot: 'Polkadot',
  ldot: 'Liquid DOT',
  xbtc: 'Interchain Bitcoin'
};

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
