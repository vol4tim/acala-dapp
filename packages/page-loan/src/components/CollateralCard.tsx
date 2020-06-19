import React, { useState, useEffect, FC, ReactNode } from 'react';
import { isEmpty } from 'lodash';
import { Card, ListConfig, List, Dropdown, DropdownConfig } from '@acala-dapp/ui-components';
import { useAllLoans, useLoan } from '@acala-dapp/react-hooks';
import { getTokenName, FormatFixed18 } from '@acala-dapp/react-components';
import classes from './CollateralCard.module.scss';
import { Fixed18 } from '@acala-network/app-util';

export const CollateralCard: FC = () => {
  const { loanTypes } = useAllLoans();
  const [active, setActive] = useState<string>('');
  const { currentUserLoanHelper } = useLoan(active);

  const listConfig: ListConfig[] = [
    {
      key: 'liquidationRatio',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Liquidation Ratio'
    },
    {
      key: 'requiredCollateralRatio',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Required Collateral Ratio'
    },
    {
      key: 'interestRate',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      ),
      title: 'Interest Rate'
    }
  ];

  useEffect(() => {
    if (!active && !isEmpty(loanTypes) && loanTypes[0].token) {
      setActive(loanTypes[0].token.toString());
    }
  }, [loanTypes, active]);

  if (isEmpty(loanTypes)) {
    return null;
  }

  const data = {
    interestRate: currentUserLoanHelper?.stableFeeAPR,
    liquidationRatio: currentUserLoanHelper?.liquidationRatio,
    requiredCollateralRatio: currentUserLoanHelper?.requiredCollateralRatio
  };

  const handleDropdownChange = (value: string): void => {
    setActive(value);
  };

  const dropdownConfig = loanTypes.map((item): DropdownConfig => {
    return {
      render: (): string => getTokenName(item.token),
      value: item.token.toString()
    };
  });

  return (
    <Card
      className={classes.root}
      header={
        <>
          <p>Collateral</p>
          <Dropdown
            border={false}
            config={dropdownConfig}
            onChange={handleDropdownChange}
            size='small'
            value={active}
          />
        </>
      }
      headerClassName={classes.header}
      padding={false}
    >
      <List
        config={listConfig}
        data={data}
      />
    </Card>
  );
};
