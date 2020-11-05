import React, { FC, useContext, ReactNode } from 'react';
import clsx from 'clsx';

import { Tag, ArrowRightOutlined } from '@acala-dapp/ui-components';
import { FormatBalance, getCurrencyIdFromName, TokenImage } from '@acala-dapp/react-components';
import { useApi } from '@acala-dapp/react-hooks';

import classes from './SwapConsole.module.scss';
import { SwapContext } from './SwapProvider';
import { token2CurrencyId } from '@acala-network/sdk-core';
import { TradeParameters } from '@acala-network/sdk-swap/trade-parameters';

interface SwapRouteProps {
  parameters: TradeParameters;
}

const SwapRoute: FC<SwapRouteProps> = ({ parameters }) => {
  const { api } = useApi();

  return (
    <div className={clsx(classes.info, classes.swapRoute)}>
      Swap Route is
      <div className={classes.content}>
        {
          parameters.path.map((item, index): ReactNode[] => {
            return [
              <TokenImage
                className={classes.token}
                currency={getCurrencyIdFromName(api, item.name)}
                key={`${item.toString()}`}
              />,
              index < parameters.path.length - 1 ? <ArrowRightOutlined
                className={classes.arrow}
                key={`${item.toString()}-arrow`}
              /> : null
            ];
          })
        }
      </div>
    </div>
  );
};

// const SwapFee: FC = () => {
//   const { api } = useApi();

//   return (
//     <div className={classes.info}>
//       Transaction Fee is <FormatRatio data={FixedPointNumber.fromInner(api.consts.dex.getExchangeFee.toString())} />
//     </div>
//   );
// };

interface Props {
  parameters: TradeParameters;
}

export const SwapInfo: FC<Props> = ({ parameters }) => {
  const { api } = useApi();
  const {
    userInput: {
      inputToken,
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
        parameters.path.length > 2 ? (
          <SwapRoute parameters={parameters} />
        ) : null
      }
    </div>
  );
};
