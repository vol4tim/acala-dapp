import React, { FC } from 'react';

import { Row, Col, Tabs, useTabs } from '@acala-dapp/ui-components';
import { useTranslation } from '@acala-dapp/react-hooks';

import { OracleInformation } from './components/OracleInformation';
import { OracleAggregated } from './components/OracleAggregated';
import { OracleDetails } from './components/OracleDetails';

type OraclePriceTabType = 'aggregated' | 'details';

const PageDeposit: FC = () => {
  const { changeTabs, currentTab } = useTabs<OraclePriceTabType>('aggregated');
  const { t } = useTranslation('page-oracle-price');

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <OracleInformation />
      </Col>
      <Col span={24}>
        <Tabs<OraclePriceTabType>
          active={currentTab}
          onChange={changeTabs}
        >
          <Tabs.Panel
            $key='aggregated'
            tab={t('Aggregated')}
          >
            <OracleAggregated />
          </Tabs.Panel>
          <Tabs.Panel
            $key='details'
            tab={t('Details')}
          >
            <OracleDetails />
          </Tabs.Panel>
        </Tabs>
      </Col>
    </Row>
  );
};

export default PageDeposit;
