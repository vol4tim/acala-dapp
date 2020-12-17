import React, { FC } from 'react';
import { styled } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';
import { ReactComponent as WithdrawnIcon } from '../assets/withdrawn-icon.svg';
import { ReactComponent as ReceiveIcon } from '../assets/receive-icon.svg';

const TitleRoot = styled.div`
  display: flex;
  align-items: center;

  height: 38px;
  border-radius: 19px;
  border: 1px solid rgba(23, 61, 201, 0.21);
  padding: 3px 6px 3px 3px;
  background: #edf3ff;

  font-size: 18px;
  color: var(--information-title-color);

  .title__icon {
    position: relative;
    display:  grid;
    place-items: center;
    margin-right: 6px;
    width: 32px;
    height: 32px;
    background-color: rgba(1, 85, 255, 0.1);
    border-radius: 50%;

    & > svg {
      width: 18px;
      height: 18px;
      margin-right: -4px;
    }
  }
`;

export const WithdrawnTitle: FC<BareProps> = ({ children }) => {
  return (
    <TitleRoot>
      <div className='title__icon'>
        <WithdrawnIcon />
      </div>
      {children}
    </TitleRoot>
  );
};

export const ReceiveTitle: FC<BareProps> = ({ children }) => {
  return (
    <TitleRoot>
      <div className='title__icon'>
        <ReceiveIcon />
      </div>
      {children}
    </TitleRoot>
  );
};

export const Addon = styled.div`
  padding: 0 8px;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.1875;
  color: var(--color-primary);
`;

export const Error = styled.div`
  height: 32px;
  border-radius: 16px;
  padding: 8px;
  font-size: 20px;
  line-height: 1.2;
  color: var(--color-white);
  transition: height .2s;
  background: var(--color-red);
`;

export const InfoRoot = styled.div`
  padding: 16px;
  border-radius: 10px;
  background: #EDF3FF;
  font-size: 16px;
  line-height: 1.1875;
  color: var(--text-color-primary);
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
`;
