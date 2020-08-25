import React, { FC, memo, useCallback } from 'react';

import { SideBarConfig } from '@acala-dapp/apps/types/sidebar';

import { ProductItem } from './ProductItem';
import classes from './Sidebar.module.scss';
import { useSetting } from '@acala-dapp/react-hooks';
import { SettingOutlined } from '@ant-design/icons';

interface Props {
  data: SideBarConfig['products'];
}

export const Products: FC<Props> = memo(({ data }) => {
  const { openSetting } = useSetting();

  const _openSetting = useCallback(() => openSetting(), [openSetting]);

  return (
    <div className={classes.products}>
      {data.map((item) => (
        <ProductItem
          key={`products-${item.name}`}
          {...item}
        />
      ))}
      <ProductItem
        icon={<SettingOutlined />}
        name='Setting'
        onClick={_openSetting}
        rel='setting'
      />
    </div>
  );
});

Products.displayName = 'Products';
