import { Token, tokenEq, FormatValue } from '@acala-dapp/react-components';
import { useAllPrices, useConstants } from '@acala-dapp/react-hooks';
import { Statistic } from '@acala-dapp/ui-components';
import React, { FC, useMemo } from 'react';

import classes from './Oracles.module.scss';

const Oracles: FC = () => {
  const { loanCurrencies } = useConstants();
  const prices = useAllPrices();

  const data = useMemo(() => {
    return loanCurrencies.map((id) => {
      const price = prices.find((i) => tokenEq(id, i.currency));

      return {
        currency: id,
        price: price
      };
    });
  }, [prices, loanCurrencies]);

  return (
    <div className={classes.root}>
      {data.map((item) => (
        <div className={classes.item}
          key={item.currency.toString()}>
          <Statistic
            title={<Token currency={item.currency}
              fullname={true}
              icon={true} />}
            value={item.price?.price ? <FormatValue data={item.price.price.toString()}
              prefix='$' /> : '--'}
          />
        </div>
      ))}
    </div>
  );
};

export default Oracles;
