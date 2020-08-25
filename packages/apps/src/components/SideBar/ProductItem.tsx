import React, { cloneElement, memo, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { SideBarItem } from '@acala-dapp/apps/types/sidebar';
import { Condition, Tooltip, UIContext, UIData } from '@acala-dapp/ui-components';

import classes from './Sidebar.module.scss';

export const ProductItem: React.FC<SideBarItem & { showTitle?: boolean }> = memo(({ icon, isExternal, name, onClick, path, rel, showTitle = true, target }) => {
  const search = window.location.search;
  const ui = useContext<UIData>(UIContext);

  if (isExternal) {
    return (
      <a
        className={classes.item}
        href={path}
        target={target}
      >
        <Tooltip
          show={!showTitle}
          title={name}
        >
          {cloneElement(icon)}
        </Tooltip>
        <Condition condition={showTitle}>
          <span className={classes.title}>
            {name}
          </span>
        </Condition>
      </a>
    );
  }

  if (onClick) {
    return (
      <div
        className={classes.item}
        onClick={onClick}
      >
        <Tooltip
          show={!showTitle}
          title={name}
        >
          {cloneElement(icon)}
        </Tooltip>
        <Condition condition={showTitle}>
          <span className={classes.title}>
            {name}
          </span>
        </Condition>
      </div>
    );
  }

  return (
    <Tooltip
      placement='right'
      show={ui.breakpoint !== 'lg'}
      title={rel === 'wallet' ? 'wallet' : name}
    >
      <NavLink className={classes.item}
        rel={rel}
        to={`${path as string}${search}`}
      >
        {cloneElement(icon)}
        <span className={classes.title}>
          {name}
        </span>
      </NavLink>
    </Tooltip>
  );
});

ProductItem.displayName = 'ProductItem';
