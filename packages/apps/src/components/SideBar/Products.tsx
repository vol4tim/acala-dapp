import React, { FC, memo } from 'react';

import { SideBarConfig } from '@acala-dapp/apps/types/sidebar';

import { ProductItem } from './ProductItem';
import classes from './Sidebar.module.scss';

interface Props {
  data: SideBarConfig['products'];
}

export const Products: FC<Props> = memo(({ data }) => {
  return (
    <div className={classes.products}>
      {data.map((item) => (
        <ProductItem
          key={`products-${item.content}`}
          {...item}
        />
      ))}
    </div>
  );
});

Products.displayName = 'Products';
