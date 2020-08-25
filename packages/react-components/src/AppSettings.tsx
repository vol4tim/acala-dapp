import React, { FC, useCallback } from 'react';
import { Drawer } from 'antd';

import { useSetting } from '@acala-dapp/react-hooks';
import { DEFAULT_ENDPOINTS } from '@acala-dapp/react-environment/utils/endpoints';
import { Radio, CloseIcon } from '@acala-dapp/ui-components';

import classes from './AppSettings.module.scss';

export const AppSettings: FC = () => {
  const {
    changeEndpoint,
    closeSetting,
    endpoint,
    settingVisible
  } = useSetting();

  const handleEndpoint = useCallback((endpoint: string) => {
    changeEndpoint(endpoint);

    window.location.reload();
  }, [changeEndpoint]);

  return (
    <Drawer
      className={classes.root}
      closeIcon={<CloseIcon />}
      onClose={closeSetting}
      placement='left'
      visible={settingVisible}
      width={520}
    >
      <div>
        <div className={classes.settingItem}>
          <p className={classes.title}>Select Network</p>
          <ul className={classes.list}>
            {
              DEFAULT_ENDPOINTS.map((config) => {
                return (
                  <li
                    className={classes.listItem}
                    key={`endpoint-${config.url}`}
                    onClick={(): void => handleEndpoint(config.url)}
                  >
                    <div>{config.name}</div>
                    <Radio
                      checked={endpoint === config.url}
                    />
                  </li>
                );
              })
            }
          </ul>
        </div>
      </div>
    </Drawer>
  );
};
