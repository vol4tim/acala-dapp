import React, { FC, useMemo } from 'react';
import DataSet from '@antv/data-set';
import dayJs from 'dayjs';
import { Chart, Geom, Tooltip } from 'bizcharts';
import { LooseObject } from 'bizcharts/lib/interface';

import { Card, CardLoading } from '@acala-dapp/ui-components';
import { useLoanOverviewChart } from '@acala-dapp/react-hooks';
import { getTokenColor } from '@acala-dapp/react-components';

const SystemOverview: FC = () => {
  const _data = useLoanOverviewChart();

  const data = useMemo(() => {
    if (!_data) return [];

    const temp1 = _data.collaterals.map((item) => {
      return {
        asset: item.asset,
        date: item.time,
        level: 'collateral',
        value: item?.value
      };
    });

    const temp2 = _data.debits.map((item) => {
      return {
        asset: item.asset,
        date: item.time,
        level: 'debit',
        value: item.value
      };
    });

    return temp1.concat(temp2).map((item) => {
      item.date = dayJs(item.date).format('YYYY-MM-DD');

      return item;
    });
  }, [_data]);

  const chartData = useMemo(() => {
    if (!data.length) return null;

    const ds = new DataSet();
    const dv = ds.createView().source(data);

    dv.transform({
      fields: ['asset', 'level', 'value', 'date'],
      type: 'pick'
    }).transform({
      callback: (obj) => {
        obj.type = obj.asset;

        return obj;
      },
      type: 'map'
    });

    return dv;
  }, [data]);

  if (!chartData) return <CardLoading height={440} />;

  return (
    <Card header={null}>
      <Chart
        autoFit
        data={chartData.rows}
        height={440}
        scale={{ date: { type: 'cat' } }}
      >
        <Tooltip shared />
        <Geom
          adjust={[
            {
              dodgeBy: 'type',
              marginRatio: 0,
              type: 'dodge'
            },
            {
              type: 'stack'
            },
            {
              dodgeBy: 'level',
              type: 'stack'
            }
          ]}
          color={['type*level', (type: string, level: string): string => level === 'debit' ? '#000' : getTokenColor(type)]}
          position='date*value*type'
          style={{
            lineWidth: 1,
            stroke: '#fff'
          }}
          tooltip={['date*value*level*type', (date, value, level, type): LooseObject => { // array
            return {
              name: `${type} ${level}`,
              value: value
            };
          }]}
          type='interval'
        />
      </Chart>
    </Card>
  );
};

export default SystemOverview;
