import React, { FC, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { CurrencyId } from '@acala-network/types/interfaces';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { TokenName, TxButton, BalanceInput, BalanceInputValue, UserBalance, FormatNumber, eliminateGap } from '@acala-dapp/react-components';
import { Dialog, Row, Col, FlexBox } from '@acala-dapp/ui-components';
import { useIncentiveShare, getPoolId, useModal, useBalance, useBalanceValidator } from '@acala-dapp/react-hooks';

import classes from './RewardCard.module.scss';
import { UserReward } from './reward-components';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';
import { ActionContainer, CardRoot, ClimeBtn, DescriptionGray, EarnExtra, EarnNumber, ExtraBtn, TokenImage } from './components';

interface ManagerModelProps {
  currency: CurrencyId;
  onClose: () => void;
  visiable: boolean;
}

const ManagerModel: FC<ManagerModelProps> = ({
  currency,
  onClose,
  visiable
}) => {
  const share = useIncentiveShare('DexIncentive', currency);

  const Header = useMemo(() => {
    return (
      <TokenName currency={currency}/>
    );
  }, [currency]);

  const [depositValue, setDepositValue, { error: depositError, reset: resetDepositValue, setValidator }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: currency
  });

  useBalanceValidator({
    currency,
    updateValidator: setValidator
  });

  const [withdrawValue, setWithdrawValue, { error: withdrawError, reset: resetWithdrawValue, setValidator: setWithdrawValidator }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: currency
  });

  useBalanceValidator({
    checkBalance: false,
    currency: currency,
    max: [share ? share.share : FixedPointNumber.ZERO, ''],
    updateValidator: setWithdrawValidator
  });

  const balance = useBalance(currency);

  const showWithdraw = useMemo(() => {
    return !share.share.isZero();
  }, [share]);

  const depositParams = useCallback(() => {
    return [
      currency,
      eliminateGap(
        new FixedPointNumber(depositValue.amount),
        balance,
        new FixedPointNumber('0.000001')
      ).toChainData()
    ];
  }, [currency, depositValue, balance]);

  const withdrawParams = useCallback(() => {
    return [
      currency,
      eliminateGap(
        new FixedPointNumber(withdrawValue.amount),
        share.share,
        new FixedPointNumber('0.000001')
      ).toChainData()
    ];
  }, [currency, withdrawValue, share]);

  const handleDepositMax = useCallback(() => {
    setDepositValue({
      amount: balance.toNumber(),
      token: currency
    });
  }, [setDepositValue, balance, currency]);

  const handleWithdrawMax = useCallback(() => {
    setWithdrawValue({ amount: share.share.toNumber(), token: currency });
  }, [setWithdrawValue, share, currency]);

  useEffect(() => {
    if (!visiable) {
      resetDepositValue();
      resetWithdrawValue();
    }
  /* eslint-disable-next-line */
  }, [visiable]);

  return (
    <Dialog
      onCancel={onClose}
      title={Header}
      visiable={visiable}
      withClose
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <FlexBox
            className={classes.label}
            justifyContent='space-between'
          >
            <p>Deposit</p>
            <div>
              {'max: '}
              <UserBalance token={currency} />
            </div>
          </FlexBox>
          <BalanceInput
            error={depositError}
            onChange={setDepositValue}
            onMax={handleDepositMax}
            value={depositValue}
          />
          <TxButton
            className={classes.fullBtn}
            disabled={!depositValue.amount}
            method='depositDexShare'
            onInblock={resetDepositValue}
            params={depositParams}
            section='incentives'
          >
            Deposit
          </TxButton>
        </Col>
        {
          showWithdraw ? (
            <Col span={24}>
              <FlexBox
                className={classes.label}
                justifyContent='space-between'
              >
                <p>Withdraw</p>
                <div>
                  {'max: '}
                  <FormatNumber data={share.share} />
                </div>
              </FlexBox>
              <BalanceInput
                error={withdrawError}
                onChange={setWithdrawValue}
                onMax={handleWithdrawMax}
                value={withdrawValue}
              />
              <TxButton
                className={classes.fullBtn}
                disabled={!withdrawValue.amount}
                method='withdrawDexShare'
                onInblock={resetWithdrawValue}
                params={withdrawParams}
                section='incentives'
              >
                Withdraw
              </TxButton>
            </Col>
          ) : null
        }
      </Row>
    </Dialog>
  );
};

interface ActionProps {
  currency: CurrencyId;
}

const Action: FC<ActionProps> = ({ currency }) => {
  const navigate = useNavigate();
  const share = useIncentiveShare('DexIncentive', currency);
  const { close, open, status } = useModal();
  const balance = useBalance(currency);

  const isShowClaim = useMemo<boolean>((): boolean => {
    return !share.share.isZero();
  }, [share]);

  const params = useMemo(() => {
    return [getPoolId('DexIncentive', currency)];
  }, [currency]);

  const goToLiquidity = useCallback(() => {
    navigate({ pathname: '/swap?tab=add-liquidity' });
  }, [navigate]);

  const showManager = useMemo(() => {
    const minimum = new FixedPointNumber('0.0000001');

    return balance.isGreaterThan(minimum) || share.share.isGreaterThan(minimum);
  }, [balance, share]);

  return (
    <ActionContainer>
      {
        isShowClaim ? (
          <ClimeBtn
            disabled={share.reward.isZero()}
            method='claimRewards'
            params={params}
            section='incentives'
          >
            Claim
          </ClimeBtn>
        ) : null
      }
      {
        showManager ? (
          <ExtraBtn onClick={(): void => open()}>
            Manager
          </ExtraBtn>
        ) : (
          <ExtraBtn
            className={classes.btn}
            onClick={goToLiquidity}
          >
            Get LP Tokens
          </ExtraBtn>
        )
      }
      <ManagerModel
        currency={currency}
        onClose={close}
        visiable={status}
      />
    </ActionContainer>
  );
};

interface LPRewardCardProps {
  lp: CurrencyId;
  rewardCurrency: CurrencyId;

  accumulatePeriod: number;
  totalReward: FixedPointNumber;
}

export const LPRewardCard: FC<LPRewardCardProps> = ({
  lp,
  rewardCurrency
}) => {
  return (
    <CardRoot>
      <TokenImage currency={lp} />
      <DescriptionGray>
        <p>Deposit <TokenName currency={lp}/></p>
        <p>Earn <TokenName currency={rewardCurrency} /></p>
      </DescriptionGray>
      <EarnNumber>
        <UserReward
          currency={lp}
          poolId='DexIncentive'
          rewardCurrency={rewardCurrency}
        />
      </EarnNumber>
      <EarnExtra>
        <TokenName currency={rewardCurrency}/> Earned
      </EarnExtra>
      <Action currency={lp} />
    </CardRoot>
  );
};
