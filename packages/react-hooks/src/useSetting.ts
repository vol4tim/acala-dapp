import { useContext } from 'react';
import { SettingContext, SettingDate } from '@acala-dapp/react-environment/SettingProvider';

export const useSetting = (): SettingDate => {
  return useContext(SettingContext);
};
