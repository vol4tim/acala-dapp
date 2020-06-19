import { useContext } from 'react';

import { ApiContext, ApiContextData } from '@acala-dapp/react-environment';

/**
 * @name useApi
 * @description get api context value
 */
export const useApi = (): ApiContextData => {
  return useContext<ApiContextData>(ApiContext);
};
