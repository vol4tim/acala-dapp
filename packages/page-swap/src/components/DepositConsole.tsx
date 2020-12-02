import React, { FC, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { Card, Alert, Row, Col, InputField, List, FlexBox } from '@acala-dapp/ui-components';
import { useApi, useLP, useBalance, useBalanceValidator, useLPEnabledCurrencies } from '@acala-dapp/react-hooks';
import { BalanceInput, UserBalance, BalanceInputValue, getCurrencyIdFromName, TokenImage, TokenName, getDexShareFromCurrencyId, LPExchangeRate, LPSize, LPShare, tokenEq, eliminateGap } from '@acala-dapp/react-components';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';

import classes from './DepositConsole.module.scss';
import { LiquidityInformation } from './LiquidityInformation';
import TxButton from './TxButton';

export const DepositConsole: FC = () => {
  const { api } = useApi();
  const lpEnableCurrencies = useLPEnabledCurrencies();
  const [token1Info, setToken1Info, {
    error: token1Error,
    ref: token1Ref,
    setValidator: setToken1Validator
  }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: lpEnableCurrencies.filter((item) => item.asToken.toString() !== 'AUSD')[0]
  });
  const [token2Info, setToken2Info, {
    error: token2Error,
    ref: token2Ref,
    setValidator: setToken2Validator
  }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: getCurrencyIdFromName(api, 'AUSD')
  });
  const lpToken = useMemo(() => getDexShareFromCurrencyId(api, token1Info.token, token2Info.token), [api, token1Info, token2Info]);
  const token1Balance = useBalance(token1Info.token);
  const token2Balance = useBalance(token2Info.token);

  // init token1 validator
  useBalanceValidator({
    currency: token1Info.token,
    updateValidator: setToken1Validator
  });

  // init token2 validator
  useBalanceValidator({
    currency: token2Info.token,
    updateValidator: setToken2Validator
  });

  const {
    availableLP,
    getAddLPSuggestAmount
  } = useLP(token1Info.token, token2Info.token);

  const params = useCallback(() => {
    if (!token1Info || !token2Info) return;

    return [
      token1Info.token,
      token2Info.token,
      eliminateGap(
        new FixedPointNumber(token1Info.amount),
        token1Balance,
        new FixedPointNumber('0.000001')
      ).toChainData(),
      eliminateGap(
        new FixedPointNumber(token2Info.amount),
        token2Balance,
        new FixedPointNumber('0.000001')
      ).toChainData()
    ];
  }, [token1Info, token2Info, token1Balance, token2Balance]);

  const handleMax = useCallback(() => {
    if (!availableLP) return;

    const suggestToken2ByToken1 = getAddLPSuggestAmount(token1Info.token, token1Balance.toNumber());
    const suggestToken1ByToken2 = getAddLPSuggestAmount(token2Info.token, token2Balance.toNumber());

    if (suggestToken2ByToken1.isZero() || suggestToken1ByToken2.isZero()) {
      return;
    }

    if (suggestToken2ByToken1.isGreaterThan(token2Balance)) {
      setToken1Info({
        amount: suggestToken1ByToken2.toNumber(),
        token: token1Info.token
      });
      setToken2Info({
        amount: token2Balance.toNumber(),
        token: token2Info.token
      });
    } else {
      setToken1Info({
        amount: token1Balance.toNumber(),
        token: token1Info.token
      });
      setToken2Info({
        amount: suggestToken2ByToken1.toNumber(),
        token: token2Info.token
      });
    }
  }, [setToken2Info, setToken1Info, token1Info, token2Info, token1Balance, token2Balance, getAddLPSuggestAmount, availableLP]);

  const isDisable = useMemo(() => {
    if (!availableLP) return true;

    return !(token1Info.amount && token2Info.amount && !token1Error && !token2Error);
  }, [availableLP, token1Info, token2Info, token1Error, token2Error]);

  const clearAmount = useCallback((value?: { token1?: Partial<BalanceInputValue>; token2?: Partial<BalanceInputValue> }) => {
    setToken1Info({
      amount: 0,
      token: token1Ref.current.token,
      ...value?.token1
    });
    setToken2Info({
      amount: 0,
      token: token2Ref.current.token,
      ...value?.token2
    });
  }, [setToken2Info, setToken1Info, token1Ref, token2Ref]);

  const handleSuccess = useCallback(() => {
    clearAmount();
  }, [clearAmount]);

  const handleToken1Change = useCallback((value: BalanceInputValue) => {
    if (!tokenEq(value.token, token1Ref.current.token)) {
      clearAmount({ token1: { token: value.token } });

      return;
    }

    setToken1Info(value);
    setToken2Info({
      amount: getAddLPSuggestAmount(value.token, value.amount).toNumber(),
      token: token2Info.token
    });
  }, [setToken1Info, setToken2Info, token2Info, getAddLPSuggestAmount, clearAmount, token1Ref]);

  const handleToken2Change = useCallback((value: BalanceInputValue) => {
    if (!tokenEq(value.token, token2Ref.current.token)) {
      clearAmount({ token2: { token: value.token } });

      return;
    }

    setToken2Info(value);
    setToken1Info({
      amount: getAddLPSuggestAmount(value.token, value.amount).toNumber(),
      token: token1Info.token
    });
  }, [setToken1Info, setToken2Info, token1Info, getAddLPSuggestAmount, clearAmount, token2Ref]);

  // clear amount when lp is not available
  useEffect(() => {
    if (!availableLP) {
      clearAmount();
    }
  }, [availableLP, clearAmount, token1Ref, token2Ref]);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <LiquidityInformation />
      </Col>
      <Col span={24}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <InputField
                leftAddition={(): ReactNode => {
                  if (!availableLP) return null;

                  return (
                    <List>
                      <List.Item
                        label='Exchange Rate'
                        value={<LPExchangeRate lp={lpToken} />}
                      />
                      <List.Item
                        label='Pool Size'
                        value={<LPSize lp={lpToken} />}
                      />
                    </List>
                  );
                }}
                leftRender={(): JSX.Element => (
                  <BalanceInput
                    disableTokens={[token2Info.token]}
                    disabled={!availableLP}
                    enableTokenSelect
                    error={token1Error}
                    onChange={handleToken1Change}
                    onMax={handleMax}
                    selectableTokens={lpEnableCurrencies}
                    value={token1Info}
                  />
                )}
                leftTitle={(): JSX.Element => (
                  <FlexBox justifyContent='space-between'>
                    <p>Deposit</p>
                    <div className={classes.inputAreaBalance}>available: <UserBalance token={token1Info.token} /></div>
                  </FlexBox>
                )}
                rightAddition={(): ReactNode => {
                  if (!availableLP) return null;

                  return (
                    <List>
                      <List.Item
                        label='Your Pool Share(%)'
                        value={
                          <LPShare
                            lp={lpToken}
                            showRatio
                          />
                        }
                      />
                    </List>
                  );
                }}
                rightRender={(): JSX.Element => {
                  return (
                    <BalanceInput
                      disableTokens={[token1Info.token]}
                      disabled={!availableLP}
                      enableTokenSelect
                      error={token2Error}
                      onChange={handleToken2Change}
                      onMax={handleMax}
                      selectableTokens={lpEnableCurrencies}
                      value={token2Info}
                    />
                  );
                }}
                rightTitle={(): JSX.Element => {
                  return (
                    <FlexBox justifyContent='space-between'>
                      <p>Deposit</p>
                      <div className={classes.inputAreaBalance}>available: <UserBalance token={token2Info.token} /></div>
                    </FlexBox>
                  );
                }}
                separation='plus'
              />
            </Col>
            {
              !availableLP ? (
                <Col span={24}>
                  <Alert
                    message={
                      <>
                        <TokenImage currency={getDexShareFromCurrencyId(api, token1Info.token, token2Info.token)} />
                        <TokenName
                          className={classes.tokenName}
                          currency={getDexShareFromCurrencyId(api, token1Info.token, token2Info.token)}
                        />
                        <span>is not an available liquidity pool.</span>
                      </>
                    }
                    messageClassName={classes.alertContent}
                    type='error'
                  />
                </Col>
              ) : null
            }
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <TxButton
          className={classes.txBtn}
          disabled={isDisable}
          method='addLiquidity'
          onInblock={handleSuccess}
          params={params}
          section='dex'
          size='large'
        >
          Add Liquidty
        </TxButton>
      </Col>
    </Row>
  );
};
