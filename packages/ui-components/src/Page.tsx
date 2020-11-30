import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { BareProps } from './types';

const Breadcrumb = styled.span`
  margin-left: 12px;
  font-weight: normal;
  font-size: 20px;
`;

const TitleRoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; 
`;

interface TitleProps extends BareProps {
  title: string;
  breadcrumb?: string;
  extra?: ReactNode;
}

let Title: FC<TitleProps> = ({ breadcrumb, className, extra, title }) => {
  return (
    <TitleRoot className={className}>
      {title}
      {breadcrumb ? <Breadcrumb>/{breadcrumb}</Breadcrumb> : null}
      {extra ?? null}
    </TitleRoot>
  );
};

Title = styled(Title)`
  display: flex;
  align-items: center;
  margin-top: 32px;
  font-size: 24px;
  line-height: 28px;
  font-weight: 500;
  color: var(--text-color-primary);
`;

const PageContainer = styled.div<{ fullscreen?: boolean }>`
  margin: 0 auto;
  max-width: ${({ fullscreen }): string => fullscreen ? '100%' : '1120px'};
`;

/**
 * @name Page
 * @description page
 */
let _Page: FC<BareProps & { fullscreen?: boolean }> = ({ children, className, fullscreen = false }) => {
  return (
    <div className={className}>
      <PageContainer fullscreen={fullscreen}>{children}</PageContainer>
    </div>
  );
};

_Page = styled(_Page)`
  flex: 1;
  box-sizing: border-box;
  max-height: 100vh;
  min-height: 100vh;
  overflow-y: overlay;
  padding: 0 40px;
  padding-bottom: 64px;
  background: var(--platform-background);
`;

const Content: FC<BareProps> = styled.div`
  margin-top: 24px;
`;

interface PageType extends FC<BareProps & { fullscreen?: boolean }> {
  Title: typeof Title;
  Content: typeof Content;
}

const Page = (_Page as unknown) as PageType;

Page.Title = Title;
Page.Content = Content;

export const SubTitle: FC<BareProps> = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  margin-bottom: 12px;
  line-height: 28px;
  font-weight: 500;
  color: var(--text-color-primary);
`;

export { Page };
