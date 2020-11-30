import React, { FC, useMemo } from 'react';
import { Chart, Tooltip, Legend, Axis, Geom } from 'bizcharts';
import dayjs from 'dayjs';
import DataSet from '@antv/data-set';
import { set } from 'lodash';

import { useOracleHistoryChart } from '@acala-dapp/react-hooks';
import { Card } from '@acala-dapp/ui-components';

const PriceChart: FC<{ currency: string }> = ({ currency }) => {
  const _data = useOracleHistoryChart(currency);

  const dv = useMemo(() => {
    if (!_data) return;

    // transfrom data
    const temp: Record<string, Record<string, string | number>> = {};
    const providers: string[] = Object.keys(_data.data);

    Object.keys(_data.data).forEach((provider) => {
      _data.data[provider].forEach((item) => {
        set(temp, [
          dayjs(item.time).format('YYYY/MM/DD HH:mm'),
          provider
        ], item.value);
      });
    });

    const data = Object.keys(temp).map((time) => ({ time, ...temp[time] }));

    const ds = new DataSet();
    const dv = ds.createView().source(data);

    dv.transform({
      fields: providers,
      key: 'key',
      type: 'fold',
      value: 'value'
    });

    console.log(dv);

    return dv;
  }, [_data]);

  return (
    <Card>
      <Chart
        autoFit
        data={dv}
        height={400}
        padding={[40, 40, 80, 40]}
        scale={{
          time: { tickCount: 10 },
          value: { min: 0 }
        }}
      >
        <Legend />
        <Axis name='time' />
        <Axis name='price' />
        <Tooltip
          crosshairs={{
            type: 'y'
          }}
        />
        <Geom
          position='time*value'
          shape={'hv'}
          size={2}
          type='line'
        />
      </Chart>
    </Card>
  );
};

export default PriceChart;
