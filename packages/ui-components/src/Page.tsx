import React, { FC } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import './Page.scss';

interface TitleProps extends BareProps {
  title: string;
  breadcrumb?: string;
}

/**
 * @name Page.Title
 * @description display title in page
 */
const Title: FC<TitleProps> = ({ breadcrumb, title }) => {
  return (
    <div className={'aca-page__title'}>
      <p className='page-title--content'>
        {title}
        {breadcrumb && <span className='page-title--breadcrumb-item'>/{breadcrumb}</span>}
      </p>
    </div>
  );
};

/**
 * @name Page
 * @description page
 */
const _Page: FC<BareProps & { fullscreen?: boolean }> = ({ children, fullscreen }) => {
  return (
    <div className={'aca-page'}>
      <div className={clsx('aca-page__container', { fullscreen: fullscreen })}>{children}</div>
    </div>
  );
};

/**
 * @name Page.Content
 * @description dispaly content in page
 */
const Content: FC<BareProps & { fullscreen?: boolean }> = ({ children, fullscreen }) => {
  return <div className={clsx('aca-page__content', { fullscreen: fullscreen })}>{children}</div>;
};

interface PageType extends FC<BareProps & { fullscreen?: boolean }> {
  Title: typeof Title;
  Content: typeof Content;
}

const Page = (_Page as unknown) as PageType;

Page.Title = Title;
Page.Content = Content;

/**
 * @name SubTitle
 * @description display sub title in page
 */
export const SubTitle: FC<BareProps> = ({ children, className }) => {
  return <p className={clsx('aca-page__sub-title', className)}>{children}</p>;
};

export { Page };
