import React, { FC, useContext, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Col, Row } from '@acala-dapp/ui-components';

import { getCurrencyIdFromName, WalletBalance } from '@acala-dapp/react-components';
import { useApi } from '@acala-dapp/react-hooks';

import { LoanTopBar } from './LoanTopBar';
import { LoanContext, LoanProvider } from './LoanProvider';
import { Overview } from './Overview';
import { LoanDetail } from './LoanDetail';

const _LoansConsole: FC = () => {
  const { api } = useApi();
  const { changeToOverview, isOverview, selectCurrency } = useContext(LoanContext);
  const params = useParams();
  const navigate = useNavigate();
  const isInit = useRef<boolean>(false);

  useEffect(() => {
    if (isInit.current) return;

    try {
      if (params.currency) {
        selectCurrency(getCurrencyIdFromName(api, params.currency));
      }

      isInit.current = true;
    } catch (e) {
      changeToOverview();
    } finally {
      navigate('/loan', { replace: true });
    }
  /* eslint-disable-next-line */
  }, [selectCurrency, api, changeToOverview]);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <LoanTopBar />
      </Col>
      <Col span={24}>
        <WalletBalance />
      </Col>
      <Col span={24}>
        {
          isOverview ? <Overview /> : <LoanDetail />
        }
      </Col>
    </Row>
  );
};

export const LoansConsole: FC = () => {
  return (
    <LoanProvider>
      <_LoansConsole />
    </LoanProvider>
  );
};
