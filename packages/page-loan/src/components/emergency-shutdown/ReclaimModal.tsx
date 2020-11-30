import React, { FC, useCallback, useMemo, useContext } from 'react';

import { FixedPointNumber } from '@acala-network/sdk-core';
import { Dialog, Button } from '@acala-dapp/ui-components';
import { useConstants, useAccounts, useBalance, useAllPrices, useApi } from '@acala-dapp/react-hooks';

import { TxButton, tokenEq, FormatValue, TokenName, FormatAddress, Token, FormatBalance, getCurrencyIdFromName } from '@acala-dapp/react-components';
import { EmergencyShutdownContext } from './EmergencyShutdownProvider';
import classes from './ReclaimModal.module.scss';

const AssetBoard: FC = () => {
  const { stableCurrency } = useConstants();
  const prices = useAllPrices();
  const { collaterals } = useContext(EmergencyShutdownContext);
  const totalValue = useMemo(() => {
    if (!prices || !collaterals) return FixedPointNumber.ZERO;

    return Object.keys(collaterals).reduce((acc, currency) => {
      const price = prices.find((i) => tokenEq(currency, i.currency));

      return acc.plus(price ? price.price.times(collaterals[currency]) : FixedPointNumber.ZERO);
    }, FixedPointNumber.ZERO);
  }, [prices, collaterals]);

  return (
    <div className={classes.assetBoard}>
      <p className={classes.title}>My Loans</p>
      <FormatValue
        className={classes.value}
        data={totalValue}
      />
      <TokenName
        className={classes.unit}
        currency={stableCurrency}
      />
    </div>
  );
};

interface ReclaimModalProps {
  visiable: boolean;
  onClose: () => void;
}

/**
 * @name TransferModal
 * @description a modal for transfer asset
 */
export const ReclaimModal: FC<ReclaimModalProps> = ({
  onClose,
  visiable
}) => {
  const { api } = useApi();
  const { stableCurrency } = useConstants();
  const stableBalance = useBalance(stableCurrency);

  const { active } = useAccounts();
  const { collaterals, setStep, updateCollateralRef } = useContext(EmergencyShutdownContext);

  const reclaimSuccess = useCallback(() => {
    onClose();
    setStep('success');
  }, [setStep, onClose]);

  const params = useMemo(() => {
    return [stableBalance.toChainData()];
  }, [stableBalance]);

  const beforeSend = useCallback(() => {
    const copyCollaterals = Object.keys(collaterals).reduce((acc, cur) => {
      acc[cur] = FixedPointNumber._fromBN(collaterals[cur]._getInner());

      return acc;
    }, {} as Record<string, FixedPointNumber>);

    updateCollateralRef(copyCollaterals);
  }, [collaterals, updateCollateralRef]);

  if (!active) return null;

  return (
    <Dialog
      action={
        <>
          <Button
            onClick={onClose}
            size='small'
          >
              Close
          </Button>
          <TxButton
            beforeSend={beforeSend}
            method='refundCollaterals'
            onInblock={reclaimSuccess}
            params={params}
            section='emergencyShutdown'
            size='small'
          >
              Confirm
          </TxButton>
        </>
      }
      className={classes.root}
      onCancel={onClose}
      title='Reclaim'
      visiable={visiable}
      withClose
    >
      <AssetBoard />
      <div className={classes.item}>
        <p className={classes.label}>Account</p>
        <div
          className={classes.address}
        >
          <FormatAddress
            address={active.address}
            withIcon
          />
        </div>
      </div>
      <div className={classes.item}>
        <p className={classes.label}>You will get</p>
        <ul className={classes.assetList}>
          {
            Object.keys(collaterals).map((currency) => {
              return (
                <li
                  className={classes.assetItem}
                  key={`reclaim-collaterall-${currency}`}
                >
                  <Token
                    currency={getCurrencyIdFromName(api, currency)}
                    icon
                    imageClassName={classes.tokenImage}
                  />
                  <FormatBalance balance={collaterals[currency]} />
                </li>
              );
            })
          }
        </ul>
      </div>
    </Dialog>
  );
};
