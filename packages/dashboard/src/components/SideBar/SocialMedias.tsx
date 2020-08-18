import React, { FC, memo } from 'react';

import { SideBarConfig } from '@acala-dapp/apps/types/sidebar';
import { ProductItem } from './ProductItem';
import classes from './Sidebar.module.scss';

interface Props {
  data: SideBarConfig['socialMedia'];
}

export const SocialMedias: FC<Props> = memo(({ data }) => {
  return (
    <div className={classes.social}>
      {data.map((item) => (
        <ProductItem
          key={`products-${item.name}`}
          showTitle={false}
          {...item}
        />
      ))}
    </div>
  );
});

SocialMedias.displayName = 'SocialMedias';
