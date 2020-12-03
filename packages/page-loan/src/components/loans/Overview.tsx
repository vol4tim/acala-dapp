import React, { FC, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Card, TableConfig, Table, Button, Step, styled } from '@acala-dapp/ui-components';
import { useConstants, useAllUserLoans } from '@acala-dapp/react-hooks';
import { Token, getTokenName, StableFeeAPR, CollateralRate, Collateral, DebitAmount } from '@acala-dapp/react-components';
import { ReactComponent as GuideBG } from '../../assets/guide-bg.svg';

import { LoanContext } from './LoanProvider';

const CGuideBG = styled(GuideBG)`
  margin: 40px 0 27px 0;
`;

const GuideRoot = styled(Card)`
  .card__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const CStep = styled(Step)`
  width: 100%;
`;

export const Guide: FC = () => {
  const navigate = useNavigate();
  const stepConfig = useMemo(() => [
    { index: 'select', text: 'Select Collateral' },
    { index: 'generate', text: 'Generate aUSD' },
    { index: 'confirm', text: 'Confirm' }
  ], []);

  const goToCreate = useCallback((): void => {
    navigate('create');
  }, [navigate]);

  return (
    <GuideRoot>
      <CStep
        config={stepConfig}
        current={'select'}
      />
      <CGuideBG />
      <Button
        onClick={goToCreate}
        size='small'
      >
        Get Started
      </Button>
    </GuideRoot>
  );
};

export const Overview: FC = () => {
  const loans = useAllUserLoans(true);
  const { selectCurrency } = useContext(LoanContext);
  const { stableCurrency } = useConstants();

  const tableConfig: TableConfig[] = [
    {
      align: 'left',
      dataIndex: 'currency',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => (
        <Token
          currency={token}
          icon
        />
      ),
      title: 'Token',
      width: 1
    },
    {
      align: 'left',
      dataIndex: 'currency',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <StableFeeAPR currency={token} />,
      title: 'Interest Rate',
      width: 1
    },
    {
      align: 'right',
      dataIndex: 'currency',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <Collateral currency={token} />,
      title: 'Deposit',
      width: 1
    },
    {
      align: 'right',
      dataIndex: 'currency',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <DebitAmount currency={token} />,
      title: `Debit ${getTokenName(stableCurrency.asToken.toString())}`,
      width: 2
    },
    {
      align: 'right',
      dataIndex: 'currency',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <CollateralRate currency={token} />,
      title: 'Current Ratio',
      width: 2
    },
    {
      align: 'right',
      dataIndex: 'currency',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => {
        const handleClick = (): void => selectCurrency(token);

        return (
          <Button
            onClick={handleClick}
            size='small'
          >
            Manage Loan
          </Button>
        );
      },
      title: 'Action',
      width: 2
    }
  ];

  if (!loans) return null;

  if (loans && loans.length === 0) return <Guide />;

  return (
    <Card
      header='Overview'
      padding={false}
    >
      <Table
        config={tableConfig}
        data={loans}
        showHeader
      />
    </Card>
  );
};
