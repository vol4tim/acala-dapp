import { padDecimalPlaces, thousand, getTokenName, formatHash, formatBalance, effectiveDecimal } from './index';
import { Fixed18 } from '@acala-network/app-util';

describe('test utils', () => {
  test('padDecimalPlaces with 10 decimal places', () => {
    expect(padDecimalPlaces(12.05, 3)).toEqual('12.050');
    expect(padDecimalPlaces('12.04', 3)).toEqual('12.040');
    expect(padDecimalPlaces(12.000000000001, 10)).toEqual('12.0000000000');
    expect(padDecimalPlaces(1.2e-8, 10)).toEqual('0.0000000120');
  });

  test('pad integer with 10 decimal places should do nothing', () => {
    expect(padDecimalPlaces(12, 10)).toEqual('12');
  });

  test('effectiveDecimal should work', () => {
    expect(effectiveDecimal(12.012345, 3)).toEqual('12.0123');
    expect(effectiveDecimal('12.04', 3)).toEqual('12.04');
    expect(effectiveDecimal(12.000000000001, 1)).toEqual('12.000000000001');
    expect(effectiveDecimal(1.2e-8, 2)).toEqual('0.000000012');
    expect(effectiveDecimal(1, 2)).toEqual('1.00');
    expect(effectiveDecimal(1.101, 2)).toEqual('1.10');
  });


  test('thousand notation should work', () => {
    expect(thousand(100)).toEqual('100');
    expect(thousand(1000)).toEqual('1,000');
    expect(thousand(1000000)).toEqual('1,000,000');
    expect(thousand(1000000.0000)).toEqual('1,000,000');
    expect(thousand(1000000.0001)).toEqual('1,000,000.0001');
    expect(thousand(1000000.0005)).toEqual('1,000,000.0005');
  });

  test('getTokenName should work', () => {
    expect(getTokenName('AUSD')).toEqual('aUSD');
    expect(getTokenName('ausd')).toEqual('aUSD');
    expect(getTokenName('aca')).toEqual('ACA');
  });

  test('formatHash should work', () => {
    expect(formatHash('0x123456789abcdef')).toEqual('0x1234......abcdef');
    expect(formatHash('')).toEqual('');
  });

  test('formatBalance should work', () => {
    // eslint-disabled
    // @ts-ignore
    expect(formatBalance().toString()).toEqual(Fixed18.ZERO.toString());
    expect(formatBalance(12).toString()).toEqual(Fixed18.fromNatural(12).toString());
    expect(formatBalance('12').toString()).toEqual(Fixed18.fromNatural(12).toString());
    expect(formatBalance(Fixed18.fromNatural(12)).toString()).toEqual(Fixed18.fromNatural(12).toString());
  });
});