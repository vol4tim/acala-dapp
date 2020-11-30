import React, { FC, useEffect, useState, useRef } from 'react';

import { FixedPointNumber } from '@acala-network/sdk-core';

import { useStore } from '@acala-dapp/react-environment';
import { Card, GridBox, styled } from '@acala-dapp/ui-components';
import { FormatPrice, FormatRatio, getCurrencyIdFromName, TokenName } from '@acala-dapp/react-components';
import { useApi } from '@acala-dapp/react-hooks';

const AggregatedCard = styled(Card)`
  width: 200px;
  padding: 24px 16px 24px 24px;
`;

const AssetName = styled(TokenName)`
  font-size: var(--text-size-lg);
  line-height: 1.333333;
  font-weight: var(--text-weight-md);
`;

const OracleAggregatedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AssetPrice = styled(FormatPrice)`
  display: block;
  margin-top: 16px;
  font-size: var(--text-size-xl);
  line-height: 1.2083333;
  font-weight: bold;
  color: var(--text-color-black);
`;

const format = (time: number): string => {
  const minute = 1000 * 60;
  const hour = 1000 * 60 * 24;

  if (time > hour) {
    const temp = Math.floor(time / hour);

    return temp + ' ' + (temp === 1 ? 'minute' : 'minutes');
  }

  if (time > minute) {
    const temp = Math.floor(time / minute);

    return temp + ' ' + (temp === 1 ? 'minute' : 'minutes');
  }

  const temp = Math.floor(time / 1000);

  return temp + ' ' + (temp === 1 ? 'second' : 'seconds');
};

export const TimeChange: FC<{ latest: number }> = styled(({ className, latest }: { className: string; latest: number }) => {
  const [spacing, setSpacing] = useState<number>(0);
  const latestRef = useRef<number>(latest);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (latestRef.current !== latest) {
      latestRef.current = latest;

      intervalRef.current = setInterval(() => {
        const now = new Date().getTime();

        setSpacing(now - latest);
      }, 1000);
    }

    return (): void => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [latest]);

  return (
    <p className={className}>{spacing === 0 ? '-' : format(spacing) + ' ago'}</p>
  );
})`
  margin-top: 18px;
  font-size: var(--text-size-sm);
  line-height: 1;
  color: var(--text-color-second);
`;

const PriceChangeRoot = styled.div<{ direction: 'up' | 'down' }>`
  position: relative;
  font-size: var(--text-size-md);
  line-height: 1.1875;
  color: ${({ direction }): string => direction === 'down' ? '#ee466a' : '#12ca6d'};

  &:after {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;

    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 7px 9px 7px;
    border-color: transparent transparent ${({ direction }): string => direction === 'down' ? '#ee466a' : '#12ca6d'} transparent;
    transform: translate3d(0, -4.5px, 0) ${({ direction }): string => direction === 'down' ? 'rotateX(180deg)' : ''};
  }
`;

const PriceChange: FC<{ latest: FixedPointNumber }> = ({ latest }) => {
  const latestRef = useRef<FixedPointNumber>(latest);
  const [ratio, setRatio] = useState<FixedPointNumber>(FixedPointNumber.ZERO);
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  useEffect(() => {
    if (!latest || !latestRef.current) return;

    if (latestRef.current.toNumber() !== latest.toNumber()) {
      const ratio = latest.minus(latestRef.current).div(latestRef.current);

      setRatio(ratio);
      setDirection(ratio.isNegative() ? 'down' : 'up');

      latestRef.current = latest;
    }
  }, [latest]);

  if (!ratio.isFinaite() || ratio.isZero()) return null;

  return (
    <PriceChangeRoot direction={direction}>
      {direction === 'up' ? '+' : ''}
      <FormatRatio
        data={ratio}
        formatNumberConfig={{
          decimalLength: 2,
          removeEmptyDecimalParts: true,
          removeTailZero: true
        }}
      />
    </PriceChangeRoot>
  );
};

interface OracleAggregatedCardProps {
  currency: string;
  price: FixedPointNumber;
}

const OracleAggregatedCard: FC<OracleAggregatedCardProps> = ({ currency, price }) => {
  const { api } = useApi();
  const [latestUpdateTime, setLatestUpdateTime] = useState<number>(0);
  const [latestPrice, setLatestPrice] = useState<FixedPointNumber>(FixedPointNumber.ZERO);

  useEffect(() => {
    const currentTime = new Date().getTime();

    if (price.toString() !== latestPrice.toString()) {
      setLatestUpdateTime(currentTime);
      setLatestPrice(price);
    }
  }, [price, setLatestUpdateTime, setLatestPrice, latestPrice]);

  return (
    <AggregatedCard padding={false}>
      <OracleAggregatedHeader>
        <AssetName currency={getCurrencyIdFromName(api, currency)} />
        <PriceChange latest={latestPrice} />
      </OracleAggregatedHeader>
      <AssetPrice
        data={price}
        prefix='$'
      />
      <TimeChange latest={latestUpdateTime} />
    </AggregatedCard>
  );
};

export const OracleAggregated: FC = () => {
  const oraclePrice = useStore('oraclePrice');

  return (
    <GridBox
      column={5}
      padding={30}
      row={'auto'}
    >
      {
        oraclePrice.Aggregated.map((item) => {
          return (
            <OracleAggregatedCard
              currency={item.currency}
              key={`aggregated-price-${item.currency}`}
              price={item.price}
            />
          );
        })
      }
    </GridBox>
  );
};
