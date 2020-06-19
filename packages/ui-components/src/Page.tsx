import React, { FC } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Page.module.scss';

interface TitleProps extends BareProps {
  title: string;
}

/**
 * @name Page.Title
 * @description display title in page
 */
const Title: FC<TitleProps> = ({ title }) => {
  return (
    <div className={classes.pageTitle}>
      <p className='page-title--content'>{title}</p>
    </div>
  );
};

/**
 * @name Page
 * @description page
 */
const _Page: FC<BareProps> = ({ children }) => {
  return (
    <div className={classes.page}>
      {children}
    </div>
  );
};

/**
 * @name Page.Content
 * @description dispaly content in page
 */
const Content: FC<BareProps> = ({ children }) => {
  return (
    <div className={classes.pageContent}>
      {children}
    </div>
  );
};

interface PageType extends FC<BareProps> {
  Title: typeof Title;
  Content: typeof Content;
}

const Page = _Page as unknown as PageType;

Page.Title = Title;
Page.Content = Content;

/**
 * @name SubTitle
 * @description display sub title in page
 */
export const SubTitle: FC<BareProps> = ({ children, className }) => {
  return (
    <p className={clsx(classes.subTitle, className)}>{children}</p>
  );
};

export { Page };
