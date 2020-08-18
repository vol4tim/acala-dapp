import React, { FC, useMemo } from 'react';
import { Chart, Interval, Tooltip } from 'bizcharts';
import { LooseObject } from 'bizcharts/lib/interface';

import { Fixed18 } from '@acala-network/app-util';

import { Card } from '@acala-dapp/ui-components';
import { useTotalCollatearl, useTotalDebit } from '@acala-dapp/react-hooks';
import { getTokenName, getTokenColor } from '@acala-dapp/react-components';

const ONE_HUNDRED = Fixed18.fromNatural(100);

export const LoanCollateralRatio: FC = () => {
  const totalCollateral = useTotalCollatearl();
  const totalDebit = useTotalDebit();
  const data = useMemo(() => {
    if (!totalDebit || !totalCollateral) return [];
    const result = [];
    const totalRatio = totalCollateral.amount.div(totalDebit.amount).mul(ONE_HUNDRED);

    result.push({
      currency: 'System',
      ratio: totalRatio.isFinity() ? totalRatio.toNumber(2, 3) : 0
    });

    totalCollateral.amountDetail.forEach((item, currency) => {
      const debit = totalDebit.amountDetail.get(currency) || Fixed18.ZERO;
      const ratio = item.div(debit).mul(ONE_HUNDRED);

      result.push({
        currency: getTokenName(currency),
        ratio: ratio.isFinity() ? ratio.toNumber(2, 3) : 0
      });
    });

    return result;
  }, [totalCollateral, totalDebit]);

  return (
    <Card
      header='Collateral Ratio'
    >
      <Chart
        animation={false}
        autoFit
        data={data}
        height={400}
        interactions={['active-region']}
        padding={[30, 30, 60, 30]}
      >
        <Interval
          color={['currency', (item: string): string => getTokenColor(item)]}
          label={['ratio', {
            content: (data: any): string => {
              return `${data.ratio}%`;
            }
          }]}
          position='currency*ratio'
          tooltip={['ratio', (ratio): LooseObject => ({
            name: 'Collateral Ratio',
            value: `${(ratio * 100).toFixed(2)} %`
          })]}
        />
        <Tooltip shared />
      </Chart>
    </Card>
  );
};
