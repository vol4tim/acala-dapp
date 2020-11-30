import { useContext } from 'react';
import { ExtensionData, ExtensionContext } from '@acala-dapp/react-environment';

/**
 * @name useAccounts
 */
export const useAccounts = (): ExtensionData => {
  const data = useContext(ExtensionContext);

  return data;
};
