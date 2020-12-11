import React, { FC, useEffect, useMemo, useState } from 'react';

import { FixedPointNumber } from '@acala-network/sdk-core';

import { Card, styled, Table, ColumnsType } from '@acala-dapp/ui-components';
import { useStore } from '@acala-dapp/react-environment';
import { OracleProvider } from '@acala-dapp/react-environment/store/modules/oracle-prices';

import { FormatPrice, getTokenName } from '@acala-dapp/react-components';

import { TimeChange } from './OracleAggregated';

const CTimeChange = styled(TimeChange)`
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.166667;
`;

const TimeChangePlaceholder = styled.div`
  margin-top: 4px;
  height: 14px;
`;

const TokenName = styled.p`
  margin-right: 108px;
  margin-bottom: 18px;
  font-size: var(--text-size-md);
  line-height: 1.166667;
  font-weight: var(--text-weight-md);
  color: var(--text-color-primary);
  text-align: left;
`;

const Price = styled(FormatPrice)<{ isHighest: boolean }>`
  height: 20px;
  padding: 0 12px;
  margin-left: -12px;
  border-radius: 10px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ isHighest }): string => isHighest ? '#6A0CDC' : '#000000'};
  background: ${({ isHighest }): string => isHighest ? '#faf6fe' : 'transparent'};
  transition: color, background .2s ease-in-out;
`;

const PriceWithChange: FC<{ price: FixedPointNumber; isHighest: boolean }> = ({ isHighest, price }) => {
  const [latestUpdateTime, setLatestUpdateTime] = useState<number>(0);
  const [latestPrice, setLatestPrice] = useState<FixedPointNumber>(FixedPointNumber.ZERO);

  useEffect(() => {
    if (!price) return;

    const currentTime = new Date().getTime();

    if (price.toString() !== latestPrice.toString()) {
      setLatestUpdateTime(currentTime);
      setLatestPrice(price);
    }
  }, [price, setLatestUpdateTime, setLatestPrice, latestPrice]);

  return (
    <div>
      <Price
        data={price}
        isHighest={isHighest}
        prefix='$'
      />
      { isHighest ? <CTimeChange latest={latestUpdateTime} /> : <TimeChangePlaceholder /> }
    </div>
  );
};

export const OracleDetails: FC = () => {
  const oraclePrices = useStore('oraclePrices');

  const data = useMemo(() => {
    const result: Record<string, FixedPointNumber | string>[] = [];

    Object.keys(oraclePrices).forEach((provider) => {
      const data = oraclePrices[provider as OracleProvider];

      data.forEach((item) => {
        const temp = result.find((resultItem) => resultItem.currency === item.currency);

        if (temp) {
          if (item.price.isGreaterThanOrEqualTo((temp.highest || FixedPointNumber.ZERO) as FixedPointNumber)) {
            temp.highest = item.price;
          }

          temp[provider] = item.price;
        } else {
          result.push({
            currency: item.currency,
            highest: item.price,
            [provider]: item.price
          });
        }
      });
    });

    return result;
  }, [oraclePrices]);

  const columns = useMemo((): ColumnsType<any> => {
    const providers: string[] = (Object.keys(oraclePrices) as unknown as string[]).sort((item) => item === 'Aggregated' ? -1 : 1);

    return [
      {
        align: 'left',
        key: 'name',
        /* eslint-disable-next-line react/display-name */
        render: (data: any): JSX.Element => <TokenName>{getTokenName(data.currency)}</TokenName>,
        title: ''
      },
      ...providers.map((item) => {
        return {
          align: 'left',
          key: item,
          /* eslint-disable-next-line react/display-name */
          render: (data: any): JSX.Element => (
            <PriceWithChange
              isHighest={(data.highest as FixedPointNumber).isEqualTo(data[item])}
              price={data[item]}
            />
          ),
          title: item
        };
      }) as ColumnsType
    ];
  }, [oraclePrices]);

  return (
    <Card
      overflowHidden={true}
      padding={false}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowClassName='striped'
      />
    </Card>
  );
};
