import React, { FC, memo, useMemo, useContext, useEffect } from 'react';

import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { CurrencyId } from '@acala-network/types/interfaces';

import { Tag } from '@acala-dapp/ui-components';
import { FormatBalance, FormatRatio, tokenEq } from '@acala-dapp/react-components';
import { usePrice, useDexExchangeRate, useConstants, useApi } from '@acala-dapp/react-hooks';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

import classes from './SwapConsole.module.scss';
import { SwapContext, PoolData } from './SwapProvider';

interface MarketRateProps {
  current: CurrencyLike;
  target: CurrencyLike;
  basePriceRate: Fixed18;
}

const MarketRate: FC<MarketRateProps> = ({ basePriceRate, current, target }) => {
  const currentPrice = usePrice(current);
  const targetPrice = usePrice(target);
  const rate = useMemo(() => {
    if (!currentPrice || !targetPrice) return Fixed18.ZERO;

    return currentPrice.div(targetPrice);
  }, [currentPrice, targetPrice]);

  return (
    <FormatBalance
      color={basePriceRate.isLessThan(rate) ? 'error' : 'success'}
      pair={[
        {
          balance: Fixed18.fromNatural(1),
          currency: current
        },
        {
          balance: rate,
          currency: target
        }
      ]}
      pairSymbol='≈'
    />
  );
};

interface PriceImpactPorps {
  pool: PoolData;
  target: number;
  supply: number;
}

const PriceImpact: FC<PriceImpactPorps> = ({ pool, supply, target }) => {
  const { setPriceImpact } = useContext(SwapContext);
  const oldExchangeRate = useDexExchangeRate(pool.supplyCurrency, pool.targetCurrency);
  const newExchangeRate = useDexExchangeRate(pool.supplyCurrency, pool.targetCurrency, supply, target);

  const result = useMemo<number>(() => {
    const result = Math.abs(newExchangeRate.sub(oldExchangeRate).div(oldExchangeRate).toNumber());

    return result > 1 ? 1 : result;
  }, [newExchangeRate, oldExchangeRate]);

  useEffect(() => {
    setPriceImpact(result);
  }, [result, setPriceImpact]);

  if (result < 0.001) return null;

  return (
    <p>
      Price Impact is <FormatRatio
        color={result < 0.01 ? 'success' : result > 0.05 ? 'error' : undefined}
        data={result}
      />
    </p>
  );
};

// TODO: it don't necessary for our dex
// interface SwapRouteProps {
//   pool: PoolData;
// }

// const SwapRoute: FC<SwapRouteProps> = ({ pool }) => {
//   const { dexBaseCurrency } = useConstants();
//   const isCrossBase = useMemo(() => {
//     return !tokenEq(pool.supplyCurrency, dexBaseCurrency) && !tokenEq(pool.targetCurrency, dexBaseCurrency);
//   }, [pool, dexBaseCurrency]);

//   if (!isCrossBase) return null;

//   return (
//     <div className={clsx(classes.info, classes.swapRoute)}>
//       Swap Route is
//       <Token currency={pool.supplyCurrency}
//         icon/>
//       <ArrowRightOutlined />
//       <Token currency={dexBaseCurrency}
//         icon/>
//       <ArrowRightOutlined />
//       <Token currency={pool.targetCurrency}
//         icon/>
//     </div>
//   );
// };

interface SwapFeeProps {
  pool: PoolData;
}

const SwapFee: FC<SwapFeeProps> = ({ pool }) => {
  const { dexBaseCurrency } = useConstants();
  const { api } = useApi();
  const isCrossBase = useMemo(() => {
    return !tokenEq(pool.supplyCurrency, dexBaseCurrency) && !tokenEq(pool.targetCurrency, dexBaseCurrency);
  }, [pool, dexBaseCurrency]);

  return (
    <div className={classes.info}>
      Transaction Fee is <FormatRatio data={convertToFixed18(api.consts.dex.getExchangeFee).mul(isCrossBase ? Fixed18.fromNatural(2) : Fixed18.fromNatural(1))} />
    </div>
  );
};

interface Props {
  supplyCurrency: CurrencyId;
  targetCurrency: CurrencyId;
  target: number;
  supply: number;
}

export const SwapInfo: FC<Props> = memo(({
  supply,
  supplyCurrency,
  target,
  targetCurrency
}) => {
  const {
    pool,
    slippage
  } = useContext(SwapContext);

  const atLeast = useMemo((): Fixed18 | number => {
    const num = Fixed18.fromNatural(target).div(Fixed18.fromNatural(1 + slippage));

    return num.isNaN() ? 0 : num;
  }, [target, slippage]);
  const exchangeRate = useDexExchangeRate(pool.supplyCurrency, pool.targetCurrency);

  return (
    <div className={classes.swapInfoRoot}>
      <p>
        You are selling
        <Tag>
          <FormatBalance balance={supply}
            currency={supplyCurrency} />
        </Tag>
        for at least
        <Tag>
          <FormatBalance
            balance={atLeast}
            currency={targetCurrency}
          />
        </Tag>
      </p>
      <p>
        Current Market Price is <MarketRate
          basePriceRate={exchangeRate}
          current={supplyCurrency}
          target={targetCurrency}
        />
      </p>
      <SwapFee pool={pool} />
      <PriceImpact
        pool={pool}
        supply={supply}
        target={target}
      />
    </div>
  );
});

SwapInfo.displayName = 'SwapInfo';
