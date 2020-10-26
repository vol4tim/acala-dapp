import React, { FC, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';
import { TokenPair, currencyId2Token, FixedPointNumber } from '@acala-network/sdk-core';

import { Card, nextTick, Alert, Grid } from '@acala-dapp/ui-components';
import { useFormValidator, useBalance, useApi, useSubscription, useLP, useLPExchangeRate } from '@acala-dapp/react-hooks';
import { BalanceInput, TxButton, numToFixed18Inner, UserBalance, BalanceInputValue, getCurrencyIdFromName, TokenImage, TokenName, getDexShareFromCurrencyId, FormatNumber, LPExchangeRate } from '@acala-dapp/react-components';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { CurrencyChangeFN } from '@acala-dapp/react-components/types';

import classes from './DepositConsole.module.scss';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import { LiquidityContext } from './LiquidityProvider';
import { useInputValue } from '@acala-dapp/react-hooks/useInputValue';

interface InputAreaProps {
  disabled?: boolean;
  disableTokens: CurrencyId[];
  error: any;
  id: string;
  name: string;
  selectableTokens?: CurrencyId[];
  value: BalanceInputValue;
  onChange: (value: BalanceInputValue) => void;
  onFocus: () => void;
  onBlur: () => void;
  onMax?: () => void;
  maxValue?: number;
  showMax?: boolean;
}

const InputArea: FC<InputAreaProps> = ({
  disableTokens,
  disabled,
  error,
  id,
  name,
  onBlur,
  onChange,
  onFocus,
  onMax,
  selectableTokens,
  showMax = true,
  value
}) => {
  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Deposit</p>
        <div className={classes.inputAreaBalance}>available: <UserBalance token={value.token} /></div>
      </div>
      <BalanceInput
        disableTokens={disableTokens}
        enableTokenSelect
        disabled={disabled}
        error={error}
        id={id}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onMax={onMax}
        selectableTokens={selectableTokens}
        showMaxBtn={showMax}
        value={value}
      />
    </div>
  );
};

InputArea.displayName = 'InputArea';

export const DepositConsole: FC = () => {
  const { api } = useApi();
  const { lpEnableCurrencies } = useContext(LiquidityContext);

  const [token1Info, setToken1Info, token1InfoRef] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: lpEnableCurrencies.filter((item) => item.asToken.toString() !== 'AUSD')[0]
  });
  const [token2Info, setToken2Info, token2InfoRef] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: getCurrencyIdFromName(api, 'AUSD') // default set token2
  });

  const {
    availableLP,
    exchangeRate,
    getAddLPSuggestAmount
  } = useLP(token1Info.token, token2Info.token);

  const [activeInput, setActiveInput] = useState<'token1' | 'token2' | 'empty'>('token1');

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
    setToken1Info({
      amount: 0,
      token: token1InfoRef.current.token
    });
    setToken2Info({
      amount: 0,
      token: token2InfoRef.current.token
    });
  }, [setToken2Info, setToken1Info, token1InfoRef, token2InfoRef]);

  useEffect(() => {
    if (activeInput !== 'token1') return;
    if (token1Info.amount === 0) return;

    setToken2Info({
      amount: getAddLPSuggestAmount(token1Info.token, token1Info.amount).toNumber(),
      token: token2InfoRef.current.token
    });
  }, [token1Info, activeInput, setToken2Info, token2InfoRef, exchangeRate, getAddLPSuggestAmount]);

  useEffect(() => {
    if (activeInput !== 'token2') return;
    if (token2Info.amount === 0) return;

    setToken1Info({
      amount: getAddLPSuggestAmount(token2Info.token, token2Info.amount).toNumber(),
      token: token1InfoRef.current.token
    });
  }, [token2Info, activeInput, setToken1Info, token1InfoRef, exchangeRate, getAddLPSuggestAmount]);

  return (
    <Card>
      <Grid container>
        <Grid
          className={classes.main}
          item
        >
          <InputArea
            disableTokens={[token2Info.token]}
            error={''}
            onBlur={(): void => setActiveInput('empty')}
            onChange={setToken1Info}
            onFocus={(): void => setActiveInput('token1')}
            onMax={() => {}}
            selectableTokens={lpEnableCurrencies}
            value={token1Info}
          />
          <AddIcon className={classes.addIcon} />
          <InputArea
            disableTokens={[token1Info.token]}
            error={''}
            onBlur={(): void => setActiveInput('empty')}
            onChange={setToken2Info}
            onFocus={(): void => setActiveInput('token2')}
            onMax={() => {}}
            selectableTokens={lpEnableCurrencies}
            value={token2Info}
          />
          <TxButton
            className={classes.txBtn}
            disabled={false}
            method='addLiquidity'
            onExtrinsicSuccess={handleSuccess}
            params={params}
            section='dex'
            size='large'
          >
            { availableLP ? 'Deposit' : 'Error' }
          </TxButton>
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
      <div>
        <ul className={classes.addon}>
          <li className={classes.addonItem}>
            <span>Exchange Rate</span>
            <FormatNumber data={exchangeRate} />
          </li>
          <li className={classes.addonItem}>
            <span>Current Pool Size</span>
          </li>
          <li className={classes.addonItem}>
            <span>Your Pool Share(%)</span>
          </li>
        </ul>
      </div>
    </Card>
  );
};
