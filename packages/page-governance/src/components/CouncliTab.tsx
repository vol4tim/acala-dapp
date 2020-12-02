import React, { FC } from 'react';
import { upperFirst } from 'lodash';

import { styled, Tabs, TabHeader, useTabs } from '@acala-dapp/ui-components';

import { CouncilsColor, CouncilType } from '../config';
import { CouncilMembers } from './CouncilMembers';

export function getCouncilType (name: string): CouncilType {
  return name.replace('Council', '') as CouncilType;
}

const CouncilTabHeader = styled(TabHeader)<{ type: CouncilType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 46px;
  padding: 8px;
  border-radius: 8px;
  margin-right: 18px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  background: ${({ active, type }): string => (CouncilsColor.get(type) as any)[(active ? 'backgroundActive' : 'background')]};
  color: ${({ active, type }): string => active ? '#ffffff' : (CouncilsColor.get(type) as any).text};
  box-shadow: ${({ active, type }): string => {
    if (active) {
      return `0 0 0 4px ${CouncilsColor.get(type)?.shadow || '#ffffff'}`;
    }

    return 'none';
  }};

  &:hover {
    box-shadow: 0 0 0 4px ${({ type }): string => CouncilsColor.get(type)?.shadow || '#ffffff'}
  }

  &::after {
    display: none;
  }
`;

export const CouncilesTab: FC<{ councils: CouncilType[] }> = ({ councils }) => {
  const { changeTabs, currentTab } = useTabs<CouncilType>('general');

  return (
    <Tabs
      active={currentTab}
      divider={false}
      onChange={changeTabs}
      slider={false}
    >
      {
        councils.map((item) => {
          return (
            <Tabs.Panel
              $key={item}
              header={
                <CouncilTabHeader
                  active={currentTab === item}
                  key={`tab-header-${item}`}
                  onClick={(): void => changeTabs(item) }
                  type={item}
                >
                  {upperFirst(item)} Council
                </CouncilTabHeader>
              }
              key={`council-${item}`}
            >
              <CouncilMembers council={item} />
            </Tabs.Panel>
          );
        })
      }
    </Tabs>
  );
};
