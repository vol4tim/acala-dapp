import React, { cloneElement, memo, useContext, FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { SideBarItem } from '@acala-dapp/apps/types/sidebar';
import { Condition, Tooltip, UIContext, UIData } from '@acala-dapp/ui-components';
import { useTranslation } from 'react-i18next';

import classes from './Sidebar.module.scss';

const InnerContent: FC<{ content: ReactNode; showContent: boolean }> = ({ content, showContent }) => {
  const { t } = useTranslation('apps');

  return (
    <Condition condition={showContent}>
      <span className={classes.title}>
        {typeof content === 'string' ? t(content) : content}
      </span>
    </Condition>
  );
};

export const ProductItem: React.FC<SideBarItem & { showContent?: boolean }> = memo(({
  content,
  icon,
  isExternal,
  onClick,
  path,
  rel,
  showContent = true,
  target
}) => {
  const ui = useContext<UIData>(UIContext);

  if (isExternal) {
    return (
      <a
        className={classes.item}
        href={path}
        target={target}
      >
        <Tooltip
          show={!showContent}
          title={content}
        >
          {cloneElement(icon)}
        </Tooltip>
        <InnerContent
          content={content}
          showContent={showContent}
        />
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
          show={!showContent}
          title={content}
        >
          {cloneElement(icon)}
        </Tooltip>
        <InnerContent
          content={content}
          showContent={showContent}
        />
      </div>
    );
  }

  return (
    <Tooltip
      placement='right'
      show={ui.breakpoint !== 'lg'}
      title={rel === 'wallet' ? 'wallet' : content}
    >
      <NavLink className={classes.item}
        rel={rel}
        to={path || ''}
      >
        {cloneElement(icon)}
        <InnerContent
          content={content}
          showContent={showContent}
        />
      </NavLink>
    </Tooltip>
  );
});

ProductItem.displayName = 'ProductItem';
