import React, { FC } from 'react';

import { Alert, Col } from '@acala-dapp/ui-components';

import { useEmergencyShutdown } from '@acala-dapp/react-hooks';

export const LoanAlert: FC = () => {
  const { isShutdown } = useEmergencyShutdown();

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
