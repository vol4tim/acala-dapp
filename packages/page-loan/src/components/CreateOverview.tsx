import React, { FC, useContext } from 'react';

import { Grid, Card } from '@acala-dapp/ui-components';
import { StableFeeAPR, LiquidationPenalty } from '@acala-dapp/react-components';

import { createProviderContext } from './CreateProvider';
import { DynamicLiquidationPrice } from './LiquidationPriceCard';
import { DynamicLiquidationRatio } from './LiquidationRatioCard';
import classes from './CreateOverview.module.scss';

export const CreateOverview: FC = () => {
  const { deposit, generate, selectedToken } = useContext(createProviderContext);

  return (
    <Grid container>
      <Grid item>
        <DynamicLiquidationPrice
          collateral={deposit}
          currency={selectedToken}
          generate={generate}
        />
      </Grid>
      <Grid item>
        <DynamicLiquidationRatio
          collateral={deposit}
          currency={selectedToken}
          generate={generate}
        />
      </Grid>
      <Grid item>
        <Card className={classes.otherInfo}
          contentClassName={classes.content}
        >
          <div className={classes.item}>
            <p>Interest Rate</p>
            <StableFeeAPR className={classes.data}
              currency={selectedToken} />
          </div>
          <div className={classes.item}>
            <p>Liquidation Penalty</p>
            <LiquidationPenalty className={classes.data}
              currency={selectedToken} />
          </div>
        </Card>
      </Grid>
    </Grid>
  );
};
