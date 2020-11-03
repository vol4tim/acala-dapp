import React, { FC, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { CurrencyId } from '@acala-network/types/interfaces';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { Token, TokenName, TxButton, BalanceInput, BalanceInputValue, UserBalance, FormatNumber, eliminateGap } from '@acala-dapp/react-components';
import { List, Button, Dialog, SpaceBetweenBox, Grid } from '@acala-dapp/ui-components';
import { useIncentiveShare, getPoolId, useModal, useBalance, useBalanceValidator } from '@acala-dapp/react-hooks';

import classes from './RewardCard.module.scss';
import { TotalReward, UserReward, PoolRate, UserPoolRate } from './reward-components';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';

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
      <>
        Manager <TokenName currency={currency}/>
      </>
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
      <Grid container>
        <Grid item>
          <SpaceBetweenBox className={classes.label}>
            <p>Deposit</p>
            <div>
              {'max: '}
              <UserBalance token={currency} />
            </div>
          </SpaceBetweenBox>
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
        </Grid>
        {
          showWithdraw ? (
            <Grid item>
              <SpaceBetweenBox className={classes.label}>
                <p>Withdraw</p>
                <div>
                  {'max: '}
                  <FormatNumber data={share.share} />
                </div>
              </SpaceBetweenBox>
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
            </Grid>
          ) : null
        }
      </Grid>
    </Dialog>
  );
};

interface DescriptionProps {
  rewardCurrency: CurrencyId;
  lp: CurrencyId;
}

const Description: FC<DescriptionProps> = ({
  lp,
  rewardCurrency
}) => {
  return (
    <div className={classes.decription}>
      Earn <TokenName currency={rewardCurrency}/> by staking <TokenName currency={lp} />
    </div>
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
    navigate({ pathname: '/amm' });
  }, [navigate]);

  return (
    <div className={classes.action}>
      {
        isShowClaim ? (
          <TxButton
            className={classes.btn}
            disabled={share.reward.isZero()}
            method='claimRewards'
            params={params}
            section='incentives'
          >
            Claim
          </TxButton>
        ) : null
      }
      {
        balance.isLessOrEqualTo(FixedPointNumber.ZERO) ? (
          <Button
            className={classes.btn}
            onClick={goToLiquidity}
          >Get Reward By Add Liquidity!</Button>
        ) : (
          <Button
            className={classes.btn}
            onClick={(): void => open()}
          >Manager</Button>
        )
      }
      <ManagerModel
        currency={currency}
        onClose={close}
        visiable={status}
      />
    </div>
  );
};

interface LPRewardCardProps {
  lp: CurrencyId;
  rewardCurrency: CurrencyId;

  accumulatePeriod: number;
  totalReward: FixedPointNumber;
}

export const LPRewardCard: FC<LPRewardCardProps> = ({
  accumulatePeriod,
  lp,
  rewardCurrency,
  totalReward
}) => {
  return (
    <div className={classes.root}>
      <Token
        currency={lp}
        icon
      />
      <Description
        lp={lp}
        rewardCurrency={rewardCurrency}
      />
      <List className={classes.information}>
        <List.Item
          label={'Pool Rate'}
          value={
            <PoolRate
              accumulatePeriod={accumulatePeriod}
              rewardCurrency={rewardCurrency}
              totalReward={totalReward}
            />
          }
        />
        <List.Item
          label={'Your Rate'}
          value={
            <UserPoolRate
              accumulatePeriod={accumulatePeriod}
              currency={lp}
              poolId='DexIncentive'
              rewardCurrency={rewardCurrency}
              totalReward={totalReward}
            />
          }
        />
        <List.Item
          label={'Total Reward'}
          value={
            <TotalReward
              currency={lp}
              poolId='DexIncentive'
              rewardCurrency={rewardCurrency}
            />
          }
        />
        <List.Item
          label={'Earned'}
          value={
            <UserReward
              currency={lp}
              poolId='DexIncentive'
              rewardCurrency={rewardCurrency}
            />
          }
        />
      </List>
      <Action
        currency={lp}
      />
    </div>
  );
};
