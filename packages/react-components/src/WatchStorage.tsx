import { FC, ReactElement } from 'react';
import { useCall } from '@acala-dapp/react-hooks';

interface Props {
  path: string;
  params: any[];
  render: (data: any) => ReactElement;
}

export const WatchStorage: FC<Props> = ({ params, path, render }) => {
  const data = useCall(path, params);

  return render(data);
};
