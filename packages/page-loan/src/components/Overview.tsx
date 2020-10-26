import React, { FC, useContext, useEffect, ReactNode } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Card, TableConfig, Table, Button, Step } from '@acala-dapp/ui-components';
import { useConstants, useAllUserLoans, useInitialize } from '@acala-dapp/react-hooks';
import { Token, getTokenName, StableFeeAPR, CollateralRate, Collateral, DebitAmount } from '@acala-dapp/react-components';
import { ReactComponent as GuideBG } from '../assets/guide-bg.svg';

import { LoanContext } from './LoanProvider';
import classes from './Overview.module.scss';

export const Guide: FC = () => {
  const { setCurrentTab } = useContext(LoanContext);
  const stepConfig = [
    {
      index: 'select',
      text: 'Select Collateral'
    },
    {
      index: 'generate',
      text: 'Generate aUSD'
    },
    {
      index: 'confirm',
      text: 'Confirm'
    }
  ];

  const handleStart = (): void => {
    setCurrentTab('create');
  };

  return (
    <Card
      className={classes.guide}
      contentClassName={classes.content}
    >
      <Step
        className={classes.step}
        config={stepConfig}
        current={'select'}
      />
      <GuideBG className={classes.guideBg} />
      <Button
        onClick={handleStart}
        size='small'
      >
        Get Started
      </Button>
    </Card>
  );
};

export const Overview: FC = () => {
  const { isInitialized, setEnd } = useInitialize();

  const loans = useAllUserLoans(true);
  const { setCurrentTab } = useContext(LoanContext);
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
        const handleClick = (): void => setCurrentTab(token);

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

  useEffect(() => {
    if (loans !== undefined) {
      setEnd();
    }
  }, [loans, setEnd]);

  // wait loading data
  if (!isInitialized) {
    return null;
  }

  if (loans && loans.length === 0) {
    return <Guide />;
  }

  return (
    <Card
      header='Overview'
      padding={false}
    >
      {
        loans && (
          <Table
            config={tableConfig}
            data={loans}
            showHeader
          />
        )
      }
    </Card>
  );
};
