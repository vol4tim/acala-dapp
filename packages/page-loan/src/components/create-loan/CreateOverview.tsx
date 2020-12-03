import React, { FC, useContext } from 'react';

import { Row, Col, Card } from '@acala-dapp/ui-components';
import { StableFeeAPR, LiquidationPenalty } from '@acala-dapp/react-components';

import { createProviderContext } from './CreateProvider';
import { DynamicLiquidationPrice } from '../common/LiquidationPriceCard';
import { DynamicLiquidationRatio } from '../common/LiquidationRatioCard';
import classes from './CreateOverview.module.scss';

export const CreateOverview: FC = () => {
  const { deposit, generate, selectedToken } = useContext(createProviderContext);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <DynamicLiquidationPrice
          collateral={deposit}
          currency={selectedToken}
          generate={generate}
        />
      </Col>
      <Col span={24}>
        <DynamicLiquidationRatio
          collateral={deposit}
          currency={selectedToken}
          generate={generate}
        />
      </Col>
      <Col span={24}>
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
      </Col>
    </Row>
  );
};
