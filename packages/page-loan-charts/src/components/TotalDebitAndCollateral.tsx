import React, { FC, useMemo, useRef } from 'react';
import { ResponsivePie, PieDatumWithColor } from '@nivo/pie';

import { Card } from '@acala-dapp/ui-components';

import { useTotalDebit, useTotalCollatearl, TotalDebitOrCollateralData } from '@acala-dapp/react-hooks';
import { FormatFixed18, getTokenColor } from '@acala-dapp/react-components';

import classes from './TotalDebitAndCollateral.module.scss';

interface OverviewDataDisplayProps {
  title: string;
  data: TotalDebitOrCollateralData | null;
}

const OverviewDataDisplay: FC<OverviewDataDisplayProps> = ({ title, data }) => {
  const pieData: PieDatumWithColor[] = useMemo(() => {
    if (!data) return [];

    const result: PieDatumWithColor[] = [];

    data.amountDetail.forEach((data, currency): void => {
      result.push({
        color: getTokenColor(currency),
        id: currency.toString(),
        label: currency.toString(),
        value: data.toNumber(2, 3)
      });
    });

    return result;
  }, [data]);

  if (!data) return null;

  return (
    <div className={classes.item}>
      <p className={classes.title}>
        {title}
        <FormatFixed18
          className={classes.amount}
          data={data.amount}
          prefix='≈ $US'
        />
      </p>
      <div className={classes.chart}>
        <ResponsivePie
          animate={true}
          colors={pieData.map((item): string => item.color)}
          cornerRadius={0}
          data={pieData}
          enableRadialLabels={false}
          enableSlicesLabels={false}
          innerRadius={0.5}
          legends={[
            {
              anchor: 'top-left',
              direction: 'column',
              itemHeight: 18,
              itemTextColor: '#999',
              itemWidth: 80,
              itemsSpacing: 8,
              symbolShape: 'circle',
              symbolSize: 18,
              translateX: -120,
              translateY: 20
            }
          ]}
          margin={{ left: 120, right: 0 }}
          padAngle={1}
          sortByValue={true}
        />
      </div>
    </div>
  );
};

const TotalDebit: FC = () => {
  const debitDetails = useTotalDebit();

  return (
    <OverviewDataDisplay data={debitDetails}
      title='Total Debits'
    />
  );
};

const TotalCollateral: FC = () => {
  const collateralDetails = useTotalCollatearl();

  return (
    <OverviewDataDisplay data={collateralDetails}
      title='Total Collaterals'
    />
  );
};

export const TotalDebitAndCollateral: FC = () => {
  return (
    <Card contentClassName={classes.root}>
      <TotalCollateral />
      <TotalDebit />
    </Card>
  );
};
