import React, { FC, memo, useMemo, useContext, useEffect } from 'react';

import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { CurrencyId } from '@acala-network/types/interfaces';

import { Tag } from '@acala-dapp/ui-components';
import { FormatBalance, FormatRatio, tokenEq } from '@acala-dapp/react-components';
import { usePrice, useDexExchangeRate, useConstants, useApi } from '@acala-dapp/react-hooks';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

import classes from './SwapConsole.module.scss';
import { SwapContext, PoolData } from './SwapProvider';
import { FixedPointNumber, token2CurrencyId } from '@acala-network/sdk-core';

interface SwapRouteProps {
  path: CurrencyId[];
}

const SwapRoute: FC<SwapRouteProps> = ({ path }) => {
  return (
    <div className={clsx(classes.info, classes.swapRoute)}>
      Swap Route is
      {
        path.map((item, index) => {
          return (
            <Token
              currency={item}
              key=`${item.toString()}`
              icon
            />
          );
        })
      }
    </div>
  );
};

const SwapFee: FC = () => {
  const { api } = useApi();

  return (
    <div className={classes.info}>
      Transaction Fee is <FormatRatio data={FixedPointNumber.fromInner(api.consts.dex.getExchangeFee.toString())} />
    </div>
  );
};

interface Props { 
  path: CurrencyId[]
}

export const SwapInfo: FC<Props> = () => {
  const { api } = useApi();
  const {
    userInput: {
      acceptSlippage,
      inputAmount,
      inputToken,
      outputAmount,
      outputToken
    }
  } = useContext(SwapContext);

  const atLeast = useMemo((): FixedPointNumber => {
    const result = new FixedPointNumber(outputAmount).div(FixedPointNumber.ONE.plus(acceptSlippage));

    return result.isNaN() ? FixedPointNumber.ZERO : result;
  }, [acceptSlippage, outputAmount]);

  return (
    <div className={classes.swapInfoRoot}>
      <p>
        You are selling
        <Tag>
          <FormatBalance balance={inputAmount}
            currency={token2CurrencyId(api, inputToken)} />
        </Tag>
        for at least
        <Tag>
          <FormatBalance
            balance={atLeast}
            currency={token2CurrencyId(api, outputToken)}
          />
        </Tag>
      </p>
    </div>
  );
};
