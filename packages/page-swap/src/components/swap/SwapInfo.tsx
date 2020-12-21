import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';

import { Tag, ArrowRightOutlined, styled } from '@acala-dapp/ui-components';
import { BalanceInputValue, FormatBalance, getCurrencyIdFromName, TokenImage } from '@acala-dapp/react-components';
import { useApi } from '@acala-dapp/react-hooks';

import classes from './SwapConsole.module.scss';
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

const InfoRoot = styled.div`
  padding: 16px;
  border-radius: 10px;
  background: #EDF3FF;
  font-size: 16px;
  line-height: 1.1875;
  color: var(--text-color-primary);
`;

const InfoContent = styled.div`
  & > span {
    line-height: 32px;
    display: inline-block;
    vertical-align: top;
  }
`;

interface Props {
  input: Partial<BalanceInputValue>;
  output: Partial<BalanceInputValue>;
  parameters: TradeParameters;
}

export const SwapInfo: FC<Props> = ({
  input,
  output,
  parameters
}) => {
  if (!parameters) return null;

  return (
    <InfoRoot>
      <InfoContent>
        <span>You are selling</span>
        <Tag>
          <FormatBalance balance={parameters.input.amount}
            currency={input.token} />
        </Tag>
        <span>for at least</span>
        <Tag>
          <FormatBalance
            balance={parameters.output.amount}
            currency={output.token}
          />
        </Tag>
      </InfoContent>
      {
        parameters.path.length > 2 ? (
          <SwapRoute parameters={parameters} />
        ) : null
      }
    </InfoRoot>
  );
};
