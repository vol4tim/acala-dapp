import { useRequestChart } from '@acala-dapp/react-hooks';
import { Card } from '@acala-dapp/ui-components';
import { Chart, Line, Tooltip } from 'bizcharts';
import dayjs from 'dayjs';
import React, { FC, useMemo } from 'react';

const PriceChart: FC<{ currency: string }> = ({ currency }) => {
  const _data = useRequestChart(
    `SELECT mean("value") AS "mean_value" FROM "acala"."autogen"."oracle" WHERE time > now() - 1d AND time < now() AND asset = '${currency.toUpperCase()}' GROUP BY time(5m), asset, account  FILL(previous)`
  );

  const data = useMemo(() => {
    if (!_data) return [];

    return _data?.[0].values.map((item: any) => {
      return {
        time: dayjs(item[0]).format('YYYY/MM/DD HH:mm'),
        value: item[1]
      };
    });
  }, [_data]);

  return (
    <Card>
      <Chart
        autoFit
        data={data}
        height={500}
        padding={[40, 40, 80, 40]}
        scale={{
          time: { tickCount: 10 },
          value: { min: 0 }
        }}
      >
        <Line
          position='time*value'
          shape='hv'
        />
        <Tooltip
          showCrosshairs
          title='time'
        />
      </Chart>
    </Card>
  );
};

export default PriceChart;
