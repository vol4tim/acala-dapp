import React, { FC, useCallback, useState, useEffect } from 'react';

import { useSetting } from '@acala-dapp/react-hooks';
import { Dialog, Button, Radio } from '@acala-dapp/ui-components';

import classes from './SelectChain.module.scss';
import { EndpointConfigItem, EndpointType, EndpointConfig } from '@acala-dapp/react-environment/utils/endpoints';

export interface SelectChainProps {
  visiable: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const TypeNameMap: Record<EndpointType, string> = {
  development: 'Development',
  production: 'Production',
  testnet: 'Test Networks'
};

export const SelectChain: FC<SelectChainProps> = ({
  onClose,
  onConfirm,
  visiable
}) => {
  const { changeEndpoint, endpoint, selectableEndpoints } = useSetting();

  const [selected, setSelected] = useState<string>('');

  const renderEndpoints = useCallback((type: EndpointType, endpoints: EndpointConfigItem[]) => {
    if (!endpoints.length) return null;

    return (
      <div className={classes.endpoint}>
        <p className={classes.endpointType}>{TypeNameMap[type]}</p>
        <ul className={classes.endpointList}>
          {
            endpoints.map((config) => (
              <li
                className={classes.endpointItem}
                key={`select-endpoint-${config.url}`}
                onClick={(): void => setSelected(config.url)}
              >
                <p>{config.name}</p>
                <Radio
                  checked={config.url === selected }
                />
              </li>
            ))
          }
        </ul>
      </div>
    );
  }, [selected, setSelected]);

  const handleSelect = useCallback(() => {
    changeEndpoint(selected);
    window.location.reload();
  }, [changeEndpoint, selected]);

  useEffect(() => {
    if (endpoint) setSelected(endpoint);
  }, [endpoint, setSelected, visiable]);

  return (
    <Dialog
      action={
        <>
          <Button
            onClick={onClose}
            size='small'
            style='normal'
            type='border'
          >
            Close
          </Button>
          <Button
            onClick={handleSelect}
            size='small'
            style='primary'
          >
            Switch
          </Button>
        </>
      }
      onCancel={onClose}
      title='Choose Networks'
      visiable={visiable}
    >
      {
        Object.keys(selectableEndpoints).map((key) => renderEndpoints(key as EndpointType, selectableEndpoints[key as EndpointType]))
      }
    </Dialog>
  );
};
