import React, { FC, useContext, useEffect } from 'react';

import { Row, Col } from '@acala-dapp/ui-components';
import { CurrencyId } from '@acala-network/types/interfaces';

import { LoanContext } from './LoanProvider';
import { DebitConsole, CollateralConsole } from './OperatorConsole';
import { LiquidationPriceCard } from '../common/LiquidationPriceCard';
import { LiquidationRatioCard } from '../common/LiquidationRatioCard';
import { useLoanHelper } from '@acala-dapp/react-hooks';

// if the loan is not exit, change to overview
const CheckLoanIsExit: FC<{ currency: CurrencyId }> = ({ currency }) => {
  const { changeToOverview } = useContext(LoanContext);
  const loan = useLoanHelper(currency);

  useEffect(() => {
    if (!loan) return;

    const flag = (loan?.debits.isZero() && loan?.collaterals.isZero()) || false;

    if (flag) {
      changeToOverview();
    }
  }, [loan, changeToOverview]);

  return null;
};

export const LoanDetail: FC = () => {
  const { changeToOverview, selectedCurrency } = useContext(LoanContext);

  useEffect(() => {
    // if the selected currency is null, change to overview
    if (!selectedCurrency) {
      changeToOverview();
    }
  }, [selectedCurrency, changeToOverview]);

  if (!selectedCurrency) return null;

  return (
    <Row
      gutter={[24, 24]}
      key={`loan-detail-${selectedCurrency.asToken.toString()}`}
    >
      <CheckLoanIsExit currency={selectedCurrency} />
      <Col span={12}>
        <LiquidationPriceCard currency={selectedCurrency} />
      </Col>
      <Col span={12}>
        <LiquidationRatioCard currency={selectedCurrency} />
      </Col>
      <Col span={12}>
        <DebitConsole currency={selectedCurrency} />
      </Col>
      <Col span={12}>
        <CollateralConsole currency={selectedCurrency} />
      </Col>
    </Row>
  );
};
