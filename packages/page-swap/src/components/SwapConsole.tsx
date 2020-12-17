import React, { FC, useContext, useCallback, useMemo, useState, useRef } from 'react';
import clsx from 'clsx';

import { Alert, Row, Col, Card, IconButton, styled } from '@acala-dapp/ui-components';
import { BalanceInputValue, BalanceInput, formatBalance, tokenEq } from '@acala-dapp/react-components';
import { useApi, useSubscription, useBalance, useBalanceValidator, useInputValue, useConstants, useModal } from '@acala-dapp/react-hooks';

import TxButton from './TxButton';
import { SwapInfo } from './SwapInfo';
import { SlippageInput } from './SlippageInput';
import { SwapContext } from './SwapProvider';
import { token2CurrencyId, currencyId2Token, FixedPointNumber } from '@acala-network/sdk-core';
import { TradeParameters } from '@acala-network/sdk-swap/trade-parameters';
import { ReactComponent as SettingIcon } from '../assets/setting.svg';
import { Addon } from './common';

const CCard = styled(Card)`
  margin: 48px auto;
  width: 550px;
  height: auto;
  border-radius: 22px;
  box-shadow: 0 0 21px rgba(1, 85, 255, 0.15);

  .card__content {
    padding: 24px;
    padding-bottom: 12px;
  }
`;

const Advanced: FC = styled(({ className }) => {
  const { status, toggle } = useModal();

  return (
    <div className={clsx(className, { open: status })}>
      <div
        className='advance__title'
        onClick={toggle}
      >
        Advance
        <SettingIcon className='advance__title__icon'/>
      </div>
      {
        status ? <SlippageInput /> : null
      }
    </div>
  );
})`
  .advance__title {
    padding: 8px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-weight: 500;
    color: var(--color-primary);
    cursor: pointer;
  }

  .advance__title__icon {
    width: 18px;
    height: 18px;
    margin-left: 4px;
    transition: transform .6s ease-in-out;
  } 

  &.open .advance__title__icon {
    transform: rotate(180deg);
  }
`;

const CIconButton = styled(IconButton)`
  margin-bottom: -24px;
  max-width: 58px !important;
  height: 58px !important;
  transform: rotate(90deg);
`;

const CBalanceInput = styled(BalanceInput)`
  border-radius: 10px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.1875;
  color: var(--color-primary);
`;

const CTxButton = styled(TxButton)`
  margin-top: 12px;
`;

export const SwapConsole: FC = () => {
  const { api } = useApi();
  const [parameters, setParameters] = useState<TradeParameters | null>(null);
  const parametersRef = useRef<TradeParameters | null>(null);
  const {
    acceptSlippage,
    availableTokens,
    changeFlag,
    getTradeParameters,
    setTradeMode,
    tradeMode
  } = useContext(SwapContext);
  const { nativeCurrency, stableCurrency } = useConstants();
  const [globalError, setGlobalError] = useState<string>('');

  const availableCurrencies = useMemo(() => {
    return Array.from(availableTokens).map((item) => token2CurrencyId(api, item));
  }, [availableTokens, api]);

  const [
    input,
    updateInput,
    {
      error: inputError,
      setValidator: setInputValidator
    }
  ] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: nativeCurrency
  });

  useBalanceValidator({
    currency: input.token,
    updateValidator: setInputValidator
  });

  const maxInputBalance = useBalance(input.token);

  const handleInputMax = useCallback(() => {
    updateInput({
      amount: maxInputBalance.toNumber()
    });
  }, [updateInput, maxInputBalance]);

  const [
    output,
    updateOutput,
    {
      error: outputError
    }
  ] = useInputValue<BalanceInputValue>({
    amount: 0,
    token: stableCurrency
  });

  const selectableInputCurrencies = useMemo(() => {
    return availableCurrencies.filter((item) => !tokenEq(item, output.token));
  }, [availableCurrencies, output]);

  const selectableOutputCurrencies = useMemo(() => {
    return selectableInputCurrencies.filter((item) => !tokenEq(item, input.token));
  }, [selectableInputCurrencies, input]);

  const handleInputFocus = useCallback(() => {
    setTradeMode('EXACT_INPUT');
  }, [setTradeMode]);

  const handleOutputFocus = useCallback(() => {
    setTradeMode('EXACT_OUTPUT');
  }, [setTradeMode]);

  const handleReverse = useCallback(() => {
    updateInput({ ...output, amount: 0 });
    updateOutput({ ...input, amount: 0 });
    setParameters(null);
  }, [input, output, updateInput, updateOutput]);

  const handleSuccess = useCallback(() => {
    updateInput({ amount: 0 });
    updateOutput({ amount: 0 });
    setParameters(null);
  }, [updateInput, updateOutput, setParameters]);

  const isDisable = useMemo(() => {
    if (!parameters) return true;

    if (parameters.midPrice.isLessOrEqualTo(FixedPointNumber.ZERO)) return true;

    if (outputError) return true;

    if (inputError) return true;

    if (input.amount <= 0) return true;

    if (output.amount <= 0) return true;

    if (globalError) return true;

    return false;
  }, [input, output, inputError, outputError, parameters, globalError]);

  const params = useCallback(() => {
    if (!parameters) return;

    const result = parameters.toChainData(tradeMode);

    return result;
  }, [parameters, tradeMode]);

  useSubscription(() => {
    if (changeFlag.value === false) {
      if (tradeMode === 'EXACT_INPUT' && input.amount === 0) return;

      if (tradeMode === 'EXACT_OUTPUT' && output.amount === 0) return;

      if (tradeMode === 'EXACT_INPUT' &&
        input.amount === parametersRef.current?.input.amount.toNumber() &&
        parametersRef.current?.input.isEqual(currencyId2Token(input.token))
      ) return;

      if (tradeMode === 'EXACT_OUTPUT' &&
        output.amount === parametersRef.current?.output.amount.toNumber() &&
        parametersRef.current?.output.isEqual(currencyId2Token(output.token))
      ) return;
    }

    return getTradeParameters(
      acceptSlippage,
      input.amount,
      input.token,
      output.amount,
      output.token,
      tradeMode
    ).subscribe({
      error: (error) => {
        setGlobalError(error.message);
      },
      next: (result) => {
        setGlobalError('');
        parametersRef.current = result;
        setParameters(result);

        if (tradeMode === 'EXACT_INPUT') {
          updateOutput({ amount: result.output.amount.toNumber() });
        } else {
          updateInput({ amount: result.input.amount.toNumber() });
        }
      }
    });
  }, [acceptSlippage, input, output, tradeMode, updateOutput, updateInput, getTradeParameters]);

  return (
    <CCard>
      <Row
        gutter={[0, 24]}
        justify='center'
      >
        <Col span={24}>
          <Title>
            Pay With
            <Addon>
              {
                tradeMode === 'EXACT_OUTPUT' && !!maxInputBalance
                  ? 'Estimated'
                  : `Available: ${formatBalance(maxInputBalance)}`
              }
            </Addon>
          </Title>
        </Col>
        <Col span={24}>
          <CBalanceInput
            enableTokenSelect
            error={inputError}
            onChange={updateInput}
            onFocus={handleInputFocus}
            onMax={handleInputMax}
            selectableTokens={selectableInputCurrencies}
            value={input}
          />
        </Col>
        <CIconButton
          icon='swap'
          onClick={handleReverse}
          type='ghost'
        />
        <Col span={24}>
          <Title>
            Receive
            <Addon>
              {tradeMode === 'EXACT_INPUT' ? 'Estimated' : ''}
            </Addon>
          </Title>
        </Col>
        <Col span={24}>
          <CBalanceInput
            disableZeroBalance={false}
            enableTokenSelect
            error={outputError}
            onChange={updateOutput}
            onFocus={handleOutputFocus}
            selectableTokens={selectableOutputCurrencies}
            value={output}
          />
        </Col>
        <Col span={24}>
          <Advanced />
        </Col>
        {
          parameters && !isDisable ? (
            <Col span={24}>
              {
                globalError ? (
                  <Alert
                    message={globalError}
                  />
                ) : (
                  <SwapInfo
                    input={input}
                    output={output}
                    parameters={parameters}
                  />
                )
              }
            </Col>
          ) : null
        }
        <CTxButton
          disabled={isDisable}
          method={tradeMode === 'EXACT_INPUT' ? 'swapWithExactSupply' : 'swapWithExactTarget'}
          onInblock={handleSuccess}
          params={params}
          section='dex'
          size='large'
        >
          Swap
        </CTxButton>
      </Row>
    </CCard>
  );
};
