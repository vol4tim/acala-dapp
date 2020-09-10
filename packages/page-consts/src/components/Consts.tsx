import React, { FC } from 'react';
import { upperFirst } from 'lodash';

import { useApi } from '@acala-dapp/react-hooks';
import { Card } from '@acala-dapp/ui-components';

import { ConstsTable } from './ConstsTable';
import classes from './consts.module.scss';

export const Consts: FC = () => {
  const { api } = useApi();

  if (!api.consts) return null;

  return (
    <Card
      header='System Constants'
      padding={true}
    >
      {
        Object.keys(api.consts).map((module) => {
          return (
            <div key={`api-consts-module-${module}`}>
              <p className={classes.module}>{upperFirst(module)}</p>
              <ConstsTable
                data={api.consts[module]}
                key={`api-consts-module-${module}`}
              />
            </div>
          );
        })
      }
    </Card>
  );
};
