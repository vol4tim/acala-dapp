import React, { cloneElement, memo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import { SideBarItem } from '../../types/sidebar';
import { Condition, ArrowDownIcon, Tooltip } from '@acala-dapp/ui-components';

import classes from './Sidebar.module.scss';

export const ProductItem: React.FC<SideBarItem & {
  showTitle?: boolean;
}> = memo(({ icon, isExternal, items, name, path, showTitle = true, target }) => {
  const search = window.location.search;

  const [isOpen, setIsOpen] = useState(true);

  if (isExternal) {
    return (
      <a className={classes.item}
        href={path}
        target={target}>
        {icon && (
          <Tooltip show={!showTitle}
            title={name}>
            {cloneElement(icon)}
          </Tooltip>
        )}
        <Condition condition={showTitle}>
          <span className={classes.title}>{name}</span>
        </Condition>
      </a>
    );
  }

  if (items) {
    return (
      <div>
        <div
          className={clsx(classes.item, classes.collapse)}
          onClick={(): void => {
            setIsOpen(!isOpen);
          }}
        >
          {icon && cloneElement(icon)}
          <span className={classes.title}>{name}</span>
          <div
            className={clsx(classes.collapseArrow, {
              [classes.open]: isOpen
            })}
          >
            <ArrowDownIcon />
          </div>
        </div>
        {isOpen && (
          <div className={classes.collapseList}>
            {items.map((item) => (
              <ProductItem key={`products-collapse-${item.name}`}
                {...item} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink className={classes.item}
      to={`${path as string}${search}`}>
      {icon && cloneElement(icon)}
      <span className={classes.title}>{name}</span>
    </NavLink>
  );
});

ProductItem.displayName = 'ProductItem';
