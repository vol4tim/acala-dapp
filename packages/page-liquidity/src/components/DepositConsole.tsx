import React, { FC, useContext, useCallback, useMemo, useEffect } from 'react';
import { FixedPointNumber } from '@acala-network/sdk-core';

import { Card, Alert, Grid, InputField, List, SpaceBetweenBox } from '@acala-dapp/ui-components';
import { useApi, useLP, useBalance } from '@acala-dapp/react-hooks';
import { BalanceInput, TxButton, UserBalance, BalanceInputValue, getCurrencyIdFromName, TokenImage, TokenName, getDexShareFromCurrencyId, LPExchangeRate, LPSize, LPShare } from '@acala-dapp/react-components';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';

import classes from './DepositConsole.module.scss';
import { LiquidityContext } from './LiquidityProvider';

export const DepositConsole: FC = () => {
  const { api } = useApi();
  const { lpEnableCurrencies } = useContext(LiquidityContext);

  const [token1Info, setToken1Info, { ref: token1Ref, reset: token1InfoReset }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: lpEnableCurrencies.filter((item) => item.asToken.toString() !== 'AUSD')[0]
  });
  const [token2Info, setToken2Info, { ref: token2Ref, reset: token2InfoReset }] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: getCurrencyIdFromName(api, 'AUSD') // default set token2
  });

  const lpToken = useMemo(() => {
    return getDexShareFromCurrencyId(api, token1Info.token, token2Info.token);
  }, [api, token1Info, token2Info]);

  const token1Balance = useBalance(token1Info.token);
  const token2Balance = useBalance(token2Info.token);

  const {
    availableLP,
    getAddLPSuggestAmount
  } = useLP(token1Info.token, token2Info.token);

  const params = useMemo(() => {
    if (!token1Info || !token2Info) return [];

    return [
      token1Info.token,
      token2Info.token,
      new FixedPointNumber(token1Info.amount).toChainData(),
      new FixedPointNumber(token2Info.amount).toChainData()
    ];
  }, [token1Info, token2Info]);

  const handleSuccess = useCallback(() => {
    token1InfoReset();
    token2InfoReset();
  }, [token1InfoReset, token2InfoReset]);

  const handleMax = useCallback(() => {
    const suggestToken2ByToken1 = getAddLPSuggestAmount(token1Info.token, token1Balance.toNumber()).toNumber();
    const suggestToken1ByToken2 = getAddLPSuggestAmount(token2Info.token, token2Balance.toNumber()).toNumber();

    console.log(token1Info.token.toString(), token2Info.token.toString());

    if (suggestToken2ByToken1 > token2Balance.toNumber()) {
      setToken1Info({
        amount: suggestToken1ByToken2,
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
        amount: suggestToken2ByToken1,
        token: token2Info.token
      });
    }
  }, [setToken2Info, setToken1Info, token1Info, token2Info, token1Balance, token2Balance, getAddLPSuggestAmount]);

  const isDisable = useMemo(() => {
    if (!availableLP) return true;

    return !(token1Info.amount && token2Info.amount);
  }, [availableLP, token1Info, token2Info]);

  const handleToken1Change = useCallback((value: BalanceInputValue) => {
    setToken1Info(value);
    setToken2Info({
      amount: getAddLPSuggestAmount(value.token, value.amount).toNumber(),
      token: token2Info.token
    });
  }, [setToken1Info, setToken2Info, token2Info, getAddLPSuggestAmount]);

  const handleToken2Change = useCallback((value: BalanceInputValue) => {
    setToken2Info(value);
    setToken1Info({
      amount: getAddLPSuggestAmount(value.token, value.amount).toNumber(),
      token: token1Info.token
    });
  }, [setToken1Info, setToken2Info, token1Info, getAddLPSuggestAmount]);

  useEffect(() => {
    if (!availableLP) {
      setToken1Info({
        amount: 0,
        token: token1Ref.current.token
      });
      setToken2Info({
        amount: 0,
        token: token2Ref.current.token
      });
    }
  }, [availableLP, setToken1Info, setToken2Info, token1Ref, token2Ref]);

  return (
    <Card>
      <Grid container>
        <Grid item>
          <InputField
            actionRender={(): JSX.Element => {
              return (
                <TxButton
                  className={classes.txBtn}
                  disabled={isDisable}
                  method='addLiquidity'
                  onExtrinsicSuccess={handleSuccess}
                  params={params}
                  section='dex'
                  size='large'
                >
                  { availableLP ? 'Deposit' : 'Error' }
                </TxButton>
              );
            }}
            leftAddition={(): JSX.Element => {
              return (
                <List>
                  <List.Item
                    label='Exchange Rate'
                    value={<LPExchangeRate lp={lpToken} />}
                  />
                  <List.Item
                    label='Current Pool Size'
                    value={<LPSize lp={lpToken} />}
                  />
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
            leftRender={(): JSX.Element => {
              return (
                <BalanceInput
                  disableTokens={[token2Info.token]}
                  enableTokenSelect
                  onChange={handleToken1Change}
                  onMax={handleMax}
                  selectableTokens={lpEnableCurrencies}
                  showMaxBtn
                  value={token1Info}
                />
              );
            }}
            leftTitle={(): JSX.Element => {
              return (
                <SpaceBetweenBox>
                  <p>Deposit</p>
                  <div className={classes.inputAreaBalance}>available: <UserBalance token={token1Info.token} /></div>
                </SpaceBetweenBox>
              );
            }}
            rightRender={(): JSX.Element => {
              return (
                <BalanceInput
                  disableTokens={[token1Info.token]}
                  enableTokenSelect
                  onChange={handleToken2Change}
                  onMax={handleMax}
                  selectableTokens={lpEnableCurrencies}
                  showMaxBtn
                  value={token2Info}
                />
              );
            }}
            rightTitle={(): JSX.Element => {
              return (
                <SpaceBetweenBox>
                  <p>Deposit</p>
                  <div className={classes.inputAreaBalance}>available: <UserBalance token={token2Info.token} /></div>
                </SpaceBetweenBox>
              );
            }}
            separation='plus'
          />
        </Grid>
        {
          !availableLP ? (
            <Grid item>
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
            </Grid>
          ) : null
        }
      </Grid>
    </Card>
  );
};
