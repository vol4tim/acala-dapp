import React, { FC, memo, useMemo, useContext, useEffect } from 'react';
import clsx from 'clsx';

import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { CurrencyId } from '@acala-network/types/interfaces';

import { Tag } from '@acala-dapp/ui-components';
import { FormatBalance, FormatRatio, tokenEq, getCurrencyIdFromName, Token, TokenImage, FormatPrice, FormatNumber } from '@acala-dapp/react-components';
import { usePrice, useDexExchangeRate, useConstants, useApi } from '@acala-dapp/react-hooks';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

import classes from './SwapConsole.module.scss';
import { SwapContext, PoolData } from './SwapProvider';
import { FixedPointNumber, token2CurrencyId } from '@acala-network/sdk-core';
import { TradeParameters } from '@acala-network/sdk-swap/trade-parameters';
import { FormItemPrefixContext } from 'antd/lib/form/context';

interface SwapRouteProps {
  parameters: TradeParameters;
}

const SwapRoute: FC<SwapRouteProps> = ({ parameters }) => {
  const { api } = useApi();

  return (
    <div className={clsx(classes.info, classes.swapRoute)}>
      Swap Route is
      {
        parameters.path.map((item): JSX.Element => {
          return (
            <TokenImage
              currency={getCurrencyIdFromName(api, item.name)}
              key={`${item.toString()}`}
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
  parameters: TradeParameters;
}

export const SwapInfo: FC<Props> = ({ parameters }) => {
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

  if (!parameters) return null;

  return (
    <div className={classes.swapInfoRoot}>
      <p>
        You are selling
        <Tag>
          <FormatBalance balance={parameters.input.amount}
            currency={token2CurrencyId(api, inputToken)} />
        </Tag>
        for at least
        <Tag>
          <FormatBalance
            balance={parameters.output.amount}
            currency={token2CurrencyId(api, outputToken)}
          />
        </Tag>
      </p>
      {
        parameters?.midPrice.isFinaite() ? (
          <p>
            The prices is <FormatPrice data={parameters.output.amount.div(parameters.input.amount)} />
          </p>
        ) : null
      }
    </div>
  );
};
