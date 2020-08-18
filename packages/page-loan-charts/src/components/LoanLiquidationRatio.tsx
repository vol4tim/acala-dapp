import { getTokenColor } from '@acala-dapp/react-components';
import { useAllLoansType } from '@acala-dapp/react-hooks';
import { Card } from '@acala-dapp/ui-components';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { Chart, Interval, Tooltip } from 'bizcharts';
import React, { FC, useMemo } from 'react';

export const LoanLiquidationRatio: FC = () => {
  const types = useAllLoansType();

  const _data = useMemo(() => {
    if (!types) return [];

    return (
      Object.keys(types).map((currency) => {
        return {
          currency: currency,
          ratio: convertToFixed18(types[currency].liquidationRatio)
        };
      }) || []
    );
  }, [types]);

  return useMemo(() => {
    return (
      <Card header='Liquidation Ratio'>
        <Chart
          animation={false}
          autoFit
          data={_data}
          height={400}
          interactions={['active-region']}
          padding={[30, 30, 60, 30]}
        >
          <Interval
            color={['currency', (item: string): string => getTokenColor(item)]}
            label={[
              'ratio',
              {
                content: (data: any): string => {
                  return `${data.ratio.mul(Fixed18.fromNatural(100)).toString(2, 3)}%`;
                }
              }
            ]}
            position='currency*ratio'
            tooltip={['ratio', (ratio): { name: string; value: string } => ({
              name: 'Liquidation Ratio',
              value: `${(ratio * 100).toFixed(2)} %`
            })]}
          />
          <Tooltip shared />
        </Chart>
      </Card>
    );
  }, [_data]);
};
