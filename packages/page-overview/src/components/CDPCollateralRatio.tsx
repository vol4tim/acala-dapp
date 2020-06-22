import React, { FC, useMemo, memo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import dayjs from 'dayjs';

import { Fixed18, calcCollateralRatio, debitToUSD } from '@acala-network/app-util';

import { Card, Grid } from '@acala-dapp/ui-components';
import { useConstants } from '@acala-dapp/react-hooks';
import { getTokenName, getTokenColor } from '@acala-dapp/react-components';

import classes from './CDPCollateralRatio.module.scss';

export const Chart: FC<{ data: any; precent?: boolean }> = ({ data, precent = false }) => {
  return (
    <div className={classes.chart}>
      <ResponsiveLine
        axisBottom={{
          format: '%b %d',
          orient: 'bottom',
          tickSize: 5,
          tickValues: 'every 2 days'
        }}
        axisLeft={{
          orient: 'left',
          tickPadding: 5,
          tickRotation: 0,
          tickSize: 5
        }}
        axisRight={null}
        axisTop={null}
        colors={data.map((item: any): string => item.color)}
        data={data}
        enableArea={true}
        enableSlices={false}
        legends={[
          {
            anchor: 'top-right',
            direction: 'column',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1
                }
              }
            ],
            itemDirection: 'left-to-right',
            itemHeight: 20,
            itemOpacity: 0.75,
            itemWidth: 80,
            itemsSpacing: 0,
            justify: false,
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            symbolShape: 'circle',
            symbolSize: 12,
            translateX: 0,
            translateY: 0
          }
        ]}
        margin={{
          bottom: 50,
          left: 100,
          right: 100,
          top: 50
        }}
        useMesh={true}
        xFormat='time:%Y-%m-%d %H:%M:%S'
        xScale={{
          format: '%Y-%m-%d %H:%M:%S',
          precision: 'second',
          type: 'time',
          useUTC: false
        }}
        yFormat={precent ? '%' : ''}
        yScale={{
          max: 'auto',
          min: 0,
          stacked: false,
          type: 'linear'
        }}
      />
    </div>
  );
};

/* eslint-disable-next-line react/display-name */
export const CDPCOllateralRatio: FC = memo(() => {
  const { loanCurrencies } = useConstants();
  const QUERY_CDP = useMemo(() => {
    return gql`
      {
        cdps(currencies: [${loanCurrencies.reduce((acc, cur) => acc + ',"' + cur + '"', '')}], limit: 100) {
          currency,
          cdps {
            totalDebit,
            totalCollateral,
            debitExchange,
            consts { defaultDebitExchangeRate },
            createAt,
            createAtBlock,
            price { amount }
          }
        }
      }
    `;
  }, [loanCurrencies]);

  const { data, loading } = useQuery(QUERY_CDP);

  const collateralRatioData = useMemo(() => {
    if (!data) return [];

    return data.cdps.map((item: any) => {
      return {
        color: getTokenColor(item.currency),
        data: item.cdps.map((item: any): any => {
          const totalDebit = Fixed18.fromParts(item.totalDebit);
          const totalCollateral = Fixed18.fromParts(item.totalCollateral);
          const debitExchange = Fixed18.fromParts(item.debitExchange ? item.debitExchange : item.consts.defaultDebitExchangeRate);
          const collateralPrice = Fixed18.fromParts(item.price ? item.price.amount : 0);
          const debitAmount = debitToUSD(totalDebit, debitExchange, Fixed18.fromNatural(1));
          const collateralRatio = calcCollateralRatio(totalCollateral.mul(collateralPrice), debitAmount);

          return {
            x: dayjs(item.createAt).format('YYYY-MM-DD HH:mm:ss'),
            y: collateralRatio.toNumber(2, 3) || 0
          };
        }),
        id: `${getTokenName(item.currency)} Collateral Ratio`
      };
    });
  }, [data]);

  const totalDebitsData = useMemo(() => {
    if (!data) return [];

    return data.cdps.map((item: any) => {
      return {
        color: getTokenColor(item.currency),
        data: item.cdps.map((item: any): any => {
          const totalDebit = Fixed18.fromParts(item.totalDebit);
          const debitExchange = Fixed18.fromParts(item.debitExchange ? item.debitExchange : item.consts.defaultDebitExchangeRate);
          const debitAmount = debitToUSD(totalDebit, debitExchange, Fixed18.fromNatural(1));

          return {
            x: dayjs(item.createAt).format('YYYY-MM-DD HH:mm:ss'),
            y: debitAmount.toNumber(2, 3) || 0
          };
        }),
        id: `${getTokenName(item.currency)} Debit`
      };
    });
  }, [data]);

  const totalCollateralsData = useMemo(() => {
    if (!data) return [];

    return data.cdps.map((item: any) => {
      return {
        color: getTokenColor(item.currency),
        data: item.cdps.map((item: any): any => {
          const totalCollateral = Fixed18.fromParts(item.totalCollateral);
          const collateralPrice = Fixed18.fromParts(item.price ? item.price.amount : 0);
          const collateralAmount = totalCollateral.mul(collateralPrice);

          return {
            x: dayjs(item.createAt).format('YYYY-MM-DD HH:mm:ss'),
            y: collateralAmount.toNumber(2, 3) || 0
          };
        }),
        id: `${getTokenName(item.currency)} Collateral`
      };
    });
  }, [data]);

  if (loading || collateralRatioData.length === 0) return null;

  return (
    <>
      <Grid item>
        <Card
          contentClassName={classes.root}
          divider={false}
          header={'Total Collateral Ratio History'}
          headerClassName={classes.header}
        >
          <Chart
            data={collateralRatioData}
            precent={true}
          />
        </Card>
      </Grid>
      <Grid item>
        <Card
          contentClassName={classes.root}
          divider={false}
          header={'Total Debit History'}
          headerClassName={classes.header}
        >
          <Chart data={totalDebitsData} />
        </Card>
      </Grid>
      <Grid item>
        <Card
          contentClassName={classes.root}
          divider={false}
          header={'Total Collateral History'}
          headerClassName={classes.header}
        >
          <Chart data={totalCollateralsData} />
        </Card>
      </Grid>
    </>
  );
});
