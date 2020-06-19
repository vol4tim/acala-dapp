import { getFormValidator } from "./useFormValidator";
import { ApiRx } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { CurrencyId } from "@acala-network/types/interfaces";

describe('useFormValidator test', () => {
  it('number should workd', async () => {
    const validator = getFormValidator({
      num: {
        type: 'number',
        max: 100,
        min: 0
      }
    }, {} as ApiRx, {} as InjectedAccountWithMeta)

    // @ts-ignore
    validator({ num: 101 }).then((result: any) => {
      expect(result).toEqual({ num: 'Value is bigger than 100' });
    });

    // @ts-ignore
    validator({ num: -1 }).then((result: any) => {
      expect(result).toEqual({ num: 'Value is less than 0' });
    });

    // @ts-ignore
    validator({ num: 0 }).then((result: any) => {
      expect(result).toEqual({});
    });

    // @ts-ignore
    validator({ num: 100 }).then((result: any) => {
      expect(result).toEqual({});
    });

    // @ts-ignore
    validator({ num: 10 }).then((result: any) => {
      expect(result).toEqual({});
    });
  });

  it('number with boundary should workd', async () => {
    const validator = getFormValidator({
      num: {
        type: 'number',
        max: 100,
        min: 0,
        equalMax: false,
        equalMin: false
      }
    }, {} as ApiRx, {} as InjectedAccountWithMeta)

    // @ts-ignore
    validator({ num: 101 }).then((result: any) => {
      expect(result).toEqual({ num: 'Value is bigger than 100' });
    });

    // @ts-ignore
    validator({ num: -1 }).then((result: any) => {
      expect(result).toEqual({ num: 'Value is less than 0' });
    });

    // @ts-ignore
    validator({ num: 100 }).then((result: any) => {
      expect(result).toEqual({ num: 'Value should not equal 100' });
    });

    // @ts-ignore
    validator({ num: 0 }).then((result: any) => {
      expect(result).toEqual({ num: 'Value should not equal 0' });
    });

    // @ts-ignore
    validator({ num: 10 }).then((result: any) => {
      expect(result).toEqual({});
    });
  });

  it('string should workd', async () => {
    const validator = getFormValidator({
      str: {
        type: 'string',
        max: 10,
        min: 2
      }
    }, {} as ApiRx, {} as InjectedAccountWithMeta)

    // @ts-ignore
    validator({ str: 'hello' }).then((result: any) => {
      expect(result).toEqual({});
    });

    // @ts-ignore
    validator({ str: 'hello world' }).then((result: any) => {
      expect(result).toEqual({ "str": "Value's length is bigger than 10" });
    });

    // @ts-ignore
    validator({ str: 'h' }).then((result: any) => {
      expect(result).toEqual({ "str": "Value's length is less than 2" });
    });

    const regValidator = getFormValidator({
      str: {
        type: 'string',
        pattern: /^a+b+c+$/
      }
    }, {} as ApiRx, {} as InjectedAccountWithMeta)

    // @ts-ignore
    regValidator({ str: 'aabbcc' }).then((result: any) => {
      expect(result).toEqual({});
    });

    // @ts-ignore
    regValidator({ str: 'aabbccdd' }).then((result: any) => {
      expect(result).toEqual({ "str": "Value is not a validate string" });
    });
  });

  it('balance should workd', async () => {
    const validator = getFormValidator({
      balance: {
        type: 'balance',
        currency: 'aca' as any as CurrencyId,
      }
    }, { derive: { currencies: { balance: async () => 100 } } } as any as  ApiRx, {} as InjectedAccountWithMeta);

    // @ts-ignore
    validator({ balance: 10 }).then((result: any) => {
      expect(result).toEqual({});
    });

    // @ts-ignore
    validator({ balance: 101 }).then((result: any) => {
      expect(result).toEqual({ "balance": "Balance is not enough" });
    });

    // @ts-ignore
    validator({ balance: -1 }).then((result: any) => {
      expect(result).toEqual({ "balance": "Value is less than 0" });
    });

    const boundaryValidator = getFormValidator({
      balance: {
        type: 'balance',
        currency: 'aca' as any as CurrencyId,
        max: 10,
        min: 2
      }
    }, { derive: { currencies: { balance: async () => 100 } } } as any as  ApiRx, {} as InjectedAccountWithMeta);

    // @ts-ignore
    boundaryValidator({ balance: 11 }).then((result: any) => {
      expect(result).toEqual({ "balance": "Value is bigger than 10" });
    });

    // @ts-ignore
    boundaryValidator({ balance: 1 }).then((result: any) => {
      expect(result).toEqual({ "balance": "Value is less than 2" });
    });

    // @ts-ignore
    boundaryValidator({ balance: 2 }).then((result: any) => {
      expect(result).toEqual({});
    });
  });
});