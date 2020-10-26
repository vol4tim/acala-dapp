import { Statistic } from '@acala-dapp/ui-components';
import { Token, FormatValue } from '@acala-dapp/react-components';
import React, { FC } from 'react';
import { useIssuance, useConstants, useTotalDebit, useTotalCollateral } from '@acala-dapp/react-hooks';

import classes from './Overview.module.scss';

const Overview: FC = () => {
  const { stableCurrency } = useConstants();
  const ausdIssue = useIssuance(stableCurrency);
  const totalDebit = useTotalDebit();
  const totalCollateral = useTotalCollateral();

  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <Statistic
          title={<Token
            currency={stableCurrency}
            fullname={true}
            icon={true}
          />}
          value={<FormatValue data={ausdIssue}
            prefix='$'
          />}
        />
      </div>
      <div className={classes.item}>
        <Statistic
          title='Total Debits'
          value={
            <FormatValue data={totalDebit?.amount}
              prefix='$'
            />
          }
        />
      </div>
      <div className={classes.item}>
        <Statistic
          title='Total Collateral'
          value={<FormatValue data={totalCollateral?.amount}
            prefix='$'
          />}
        />
      </div>
    </div>
  );
};

export default Overview;
