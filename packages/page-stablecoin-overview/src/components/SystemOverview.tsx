import React, { FC, useMemo } from 'react';
import { set, without } from 'lodash';
import DataSet from '@antv/data-set';
import dayJs from 'dayjs';
import { Chart, Geom, Tooltip } from 'bizcharts';
import { LooseObject } from 'bizcharts/lib/interface';

import { Card, CardLoading } from '@acala-dapp/ui-components';
import { useRequestChart } from '@acala-dapp/react-hooks';
import { getTokenColor } from '@acala-dapp/react-components';

const SystemOverview: FC = () => {
  const _data = useRequestChart('SELECT mean("collateralValue") AS "collateral", mean("debitlValue") AS "debit" FROM "acala"."autogen"."cdp" WHERE time > now() - 7d AND time < now() GROUP BY time(1d), "asset" FILL(previous)');

  const data = useMemo(() => {
    if (!_data) return [];

    const temp: Record<string, any>[] = [];

    _data.forEach((item) => {
      item.values.forEach((value) => {
        const index = temp.findIndex((item) => item.date === value[0]);

        if (index !== -1) {
          set(temp, [index, `${item.tags.asset}_collateral`], value[1] || 0);
          set(temp, [index, `${item.tags.asset}_debit`], value[2] || 0);
        } else {
          temp.push({
            date: value[0],
            [`${item.tags.asset}_collateral`]: value[1] || 0,
            [`${item.tags.asset}_debit`]: value[2] || 0
          });
        }
      });
    });

    return temp.map((item) => {
      item.date = dayJs(item.date).format('YYYY-MM-DD');

      return item;
    });
  }, [_data]);

  const chartData = useMemo(() => {
    if (!data.length) return null;

    const ds = new DataSet();
    const dv = ds.createView().source(data);

    dv.transform({
      fields: without(Object.keys(data[0]), 'date'),
      key: 'key',
      type: 'fold',
      value: 'value'
    }).transform({
      callback: (obj) => {
        obj.type = obj.key.split('_')[0];
        obj.level = obj.key.split('_')[1];

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
