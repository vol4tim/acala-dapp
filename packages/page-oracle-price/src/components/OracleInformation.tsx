import React, { FC } from 'react';

import { Information } from '@acala-dapp/ui-components';
import { useTranslation } from '@acala-dapp/react-hooks';

export const OracleInformation: FC = () => {
  const { t } = useTranslation('page-oracle-price');

  return (
    <Information
      content={t('open_oracle_gateway_information')}
      title={t('Open Oracle Gateway')}
    />
  );
};
