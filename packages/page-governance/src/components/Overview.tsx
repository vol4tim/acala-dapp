import React, { FC, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { useCouncilList } from '@acala-dapp/react-hooks';
import { ArrowPixelIcon, styled, SubTitle } from '@acala-dapp/ui-components';

import { BareProps, ClickAbleProps } from '@acala-dapp/ui-components/types';
import { usePageTitle } from '@acala-dapp/react-environment';
import { CouncilesTab, getCouncilType } from './CouncliTab';

const OverviewSubTitleExtra = styled<FC<{ content: string } & BareProps & ClickAbleProps >>(({ className, content, onClick }) => {
  return (
    <div
      className={className}
      onClick={onClick}
    >
      {content}
      <ArrowPixelIcon />
    </div>
  );
})`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--color-primary);
  user-select: none;
  cursor: pointer;

  > svg {
    margin-left: 16px;
    height: 14px;
  }
`;

export const Overview: FC = () => {
  const councils = useCouncilList();
  const naviagete = useNavigate();

  const _councils = useMemo(() => {
    if (!councils) return [];

    return councils.map(getCouncilType);
  }, [councils]);

  const goToCouncilDetailPage = useCallback(() => {
    naviagete('councils');
  }, [naviagete]);

  // set page title
  usePageTitle({ content: 'Governance Overview' });

  return (
    <>
      <SubTitle
        extra={
          <OverviewSubTitleExtra
            content='View All Councils'
            onClick={goToCouncilDetailPage}
          />
        }
      >
        Councils
      </SubTitle>
      <CouncilesTab councils={_councils} />
    </>
  );
};
