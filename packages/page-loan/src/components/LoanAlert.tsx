import React, { FC, useContext } from 'react';

import { Alert, Col } from '@acala-dapp/ui-components';

import { LoanContext } from './LoanProvider';

export const LoanAlert: FC = () => {
  const { isShutdown } = useContext(LoanContext);

  // emergency shutdown message is the most important
  if (isShutdown) {
    return (
      <Col span={24}>
        <Alert
          message='Emergency Shutdown is Triggered'
          type='warning'
        />
      </Col>
    );
  }

  return null;
};
