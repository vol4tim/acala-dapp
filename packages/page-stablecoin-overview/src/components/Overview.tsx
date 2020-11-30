import { styled, Statistic } from '@acala-dapp/ui-components';
import { Token, FormatValue } from '@acala-dapp/react-components';
import React, { FC } from 'react';
import { useIssuance, useConstants, useTotalDebit, useTotalCollateral } from '@acala-dapp/react-hooks';

const OverviewRoot = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: -12px;
`;

const OverviewItem = styled.div`
  padding: 12px;
`;

const Overview: FC = () => {
  const { stableCurrency } = useConstants();
  const ausdIssue = useIssuance(stableCurrency);
  const totalDebit = useTotalDebit();
  const totalCollateral = useTotalCollateral();

  return (
    <OverviewRoot>
      <OverviewItem>
        <Statistic
          title={<Token
            currency={stableCurrency}
            fullname={true}
            icon={true}
          />}
          value={<FormatValue data={ausdIssue}
            prefix='$'
          />}
        />
      </OverviewItem>
      <OverviewItem>
        <Statistic
          title='Total Debits'
          value={
            <FormatValue data={totalDebit?.amount}
              prefix='$'
            />
          }
        />
      </OverviewItem>
      <OverviewItem>
        <Statistic
          title='Total Collateral'
          value={<FormatValue data={totalCollateral?.amount}
            prefix='$'
          />}
        />
      </OverviewItem>
    </OverviewRoot>
  );
};

export default Overview;
