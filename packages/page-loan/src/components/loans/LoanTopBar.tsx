import React, { FC, memo, useCallback, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { CurrencyId } from '@acala-network/types/interfaces';
import { TokenImage, TokenName, CollateralRate, tokenEq } from '@acala-dapp/react-components';
import { useAllUserLoans, filterEmptyLoan, useLoanHelper } from '@acala-dapp/react-hooks';
import { styled } from '@acala-dapp/ui-components';

import { ReactComponent as OverviewIcon } from '../../assets/overview.svg';
import { ReactComponent as AddIcon } from '../../assets/add.svg';
import { LoanContext } from './LoanProvider';
import { getLoanStatus } from '../../utils';

interface LoanItemProps {
  token: CurrencyId;
}

function getItemColor ({
  active,
  danger,
  warning
}: { active?: boolean; danger?: boolean; warning?: boolean }): string {
  if (active) return 'var(--color-primary)';

  if (danger) return '#fa0000';

  if (warning) return '#f7b500';

  return '';
}

const LoanItemRoot = styled.div<{
  active?: boolean;
  danger?: boolean;
  warning?: boolean;
}>`
  margin: 12px 0 0 24px;
  height: 64px;
  display: grid;
  grid-template-columns: 65px 1fr;
  border: 1px solid #d8d8d8;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition: all 200ms ease;
  overflow: hidden;
  font-weight: 500;

  border-color: ${getItemColor};

  &:hover {
    background: #eee;

    & > .loan-item__icon {
      border-color: #ddd;
    }
  }

  > .loan-item__collateral-rate {
    color: ${getItemColor};
  }
`;

const LoanItemIcon = styled.div`
  height: 60px;
  display: grid;
  place-items: center;
  border-right: 1px solid #ebeef5;
`;

const LoanItemContent = styled.div`
  min-width: 151px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  > .loan-item__token-name {
    text-align: center;
    font-size: 14px;
    line-height: 16px;
  }

  > .loan-item__collateral-rate {
    margin-top: 6px;
    font-size: 21px;
    line-height: 25px;
    color: #173DC9;
  }
`;

const LoanItem: FC<LoanItemProps> = memo(({ token }) => {
  const {
    selectCurrency,
    selectedCurrency
  } = useContext(LoanContext);
  const loan = useLoanHelper(token);
  const status = useMemo(() => {
    if (!loan) return null;

    return getLoanStatus(loan.collateralRatio, loan.liquidationRatio);
  }, [loan]);
  const handleClick = useCallback(() => {
    selectCurrency(token);
  }, [token, selectCurrency]);

  if (!loan || !status) return null;

  return (
    <LoanItemRoot
      active={selectedCurrency ? tokenEq(token, selectedCurrency) : false}
      danger={status.status === 'DANGEROUS'}
      onClick={handleClick}
      warning={status.status === 'WARNING'}
    >
      <LoanItemIcon className='loan-item__icon'>
        <TokenImage currency={token} />
      </LoanItemIcon>
      <LoanItemContent>
        <TokenName
          className='loan-item__token-name'
          currency={token}
        />
        <CollateralRate
          className='loan-item__collateral-rate'
          currency={token}
          formatNumberConfig={{
            decimalLength: 6,
            removeEmptyDecimalParts: false,
            removeTailZero: false
          }}
        />
      </LoanItemContent>
    </LoanItemRoot>
  );
});

LoanItem.displayName = 'LoanItem';

const OverviewContent = styled(LoanItemContent)`
  justify-content: center;
  font-size: 16px;
  line-height: 1.1875;
`;

const LoanOverview: FC = memo(() => {
  const { changeToOverview, isOverview } = useContext(LoanContext);

  return (
    <LoanItemRoot
      active={isOverview}
      onClick={changeToOverview}
    >
      <LoanItemIcon className='loan-item__icon'>
        <OverviewIcon />
      </LoanItemIcon>
      <OverviewContent>
        OVERVIEW
      </OverviewContent>
    </LoanItemRoot>
  );
});

LoanOverview.displayName = 'Loan Overview';

const LoanAddRoot = styled(LoanItemRoot)`
  background: #000a39;
  color: #ffffff;
  transition: background .2s cubic-bezier(0.0, 0, 0.2, 1);

  &:hover {
    background: #333b61;
  }

  &:active {
    background: #000419;
  }
`;

const LoanAddContent = styled(LoanItemContent)`
  justify-content: center;
  font-size: 16px;
  line-height: 1.1875;
`;

const LoanAdd: FC = () => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate('create');
  }, [navigate]);

  return (
    <LoanAddRoot onClick={handleClick}>
      <LoanItemIcon className='loan-item__icon'>
        <AddIcon />
      </LoanItemIcon>
      <LoanAddContent>
        Create
      </LoanAddContent>
    </LoanAddRoot>
  );
};

const LoanTopBarRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -12px 0 0 -24px;
`;

export const LoanTopBar: FC = () => {
  const loans = useAllUserLoans();

  const isShowAddBtn = useMemo((): boolean => {
    if (!loans) return false;

    return loans.length !== filterEmptyLoan(loans).length;
  }, [loans]);

  if (loans === null) return null;

  return (
    <LoanTopBarRoot>
      <LoanOverview />
      {
        filterEmptyLoan(loans).map((item) => (
          <LoanItem
            key={`loan-top-bar-${item.currency}`}
            token={item.currency as unknown as CurrencyId}
          />
        ))
      }
      { isShowAddBtn ? <LoanAdd /> : null }
    </LoanTopBarRoot>
  );
};
