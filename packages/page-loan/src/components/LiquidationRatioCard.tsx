import React, { FC, useMemo } from 'react';
import clsx from 'clsx';

import { Fixed18, calcCollateralRatio } from '@acala-network/app-util';

import { Card, BulletBar, BulletBarConfigItem } from '@acala-dapp/ui-components';
import { useLoanHelper, usePrice } from '@acala-dapp/react-hooks';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

import { getLoanStatus, LoanStatus } from '../utils';
import classes from './Liquidation.module.scss';

interface Props {
  currency: CurrencyLike;
}

const convertToPercentage = (data: Fixed18): number => {
  return data.mul(Fixed18.fromNatural(100)).toNumber(2, 3) || 0;
};

export const LiquidationRatioCard: FC<Props> = ({ currency }) => {
  const helper = useLoanHelper(currency);
  const price = usePrice(currency);
  const status = useMemo<LoanStatus | null>(() => {
    if (!helper) return null;

    return getLoanStatus(helper.collateralRatio, helper.liquidationRatio);
  }, [helper]);

  const config = useMemo<BulletBarConfigItem[]>(() => {
    if (!helper || !status) return [];

    return [
      {
        color: status.color,
        data: convertToPercentage(helper.collateralRatio),
        dataTransfer: (i: number): string => `${i}%`,
        label: 'Current Ratio',
        labelStatus: status.description
      },
      {
        color: '#0f32da',
        data: convertToPercentage(helper.liquidationRatio),
        dataTransfer: (i: number): string => `${i}%`,
        label: 'Liquidatio Ratio'
      }
    ];
  }, [helper, status]);

  if (!helper || !price || !status) {
    return null;
  }

  return (
    <Card
      divider={false}
      header='Liquidation Ratio'
      headerClassName={clsx(classes.header, classes[status.status])}
      overflowHidden
    >
      <BulletBar config={config} />
    </Card>
  );
};

interface DynamicLiquidationProps {
  currency: CurrencyLike;
  collateral: number;
  generate: number;
}

export const DynamicLiquidationRatio: FC<DynamicLiquidationProps> = ({
  collateral,
  currency,
  generate
}) => {
  const helper = useLoanHelper(currency);
  const price = usePrice(currency);

  const collateralRatio = useMemo<Fixed18>(() => {
    if (!helper) return Fixed18.ZERO;

    return calcCollateralRatio(
      helper.collaterals.add(Fixed18.fromNatural(collateral)).mul(helper.collateralPrice),
      helper.debitAmount.add(Fixed18.fromNatural(generate))
    );
  }, [helper, collateral, generate]);

  const status = useMemo<LoanStatus | null>(() => {
    if (!helper) return null;

    return getLoanStatus(collateralRatio, helper.liquidationRatio);
  }, [helper, collateralRatio]);

  const config = useMemo<BulletBarConfigItem[]>(() => {
    if (!helper || !status) return [];

    return [
      {
        color: status.color,
        data: convertToPercentage(collateralRatio),
        dataTransfer: (i: number): string => `${i}%`,
        label: 'Current Ratio',
        labelStatus: status.description
      },
      {
        color: '#0f32da',
        data: convertToPercentage(helper.liquidationRatio),
        dataTransfer: (i: number): string => `${i}%`,
        label: 'Liquidation Ratio'
      }
    ];
  }, [helper, status, collateralRatio]);

  if (!helper || !price || !status) {
    return null;
  }

  return (
    <Card
      divider={false}
      header='Liquidation Ratio'
      headerClassName={clsx(classes.header, classes[status.status])}
      overflowHidden
    >
      <BulletBar config={config} />
    </Card>
  );
};
