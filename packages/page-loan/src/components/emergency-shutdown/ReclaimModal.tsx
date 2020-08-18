import React, { FC, useCallback, useMemo, useContext } from 'react';

import { Fixed18 } from '@acala-network/app-util';
import { Dialog, Button } from '@acala-dapp/ui-components';
import { useConstants, useAccounts, useBalance, useAllPrices } from '@acala-dapp/react-hooks';

import { TxButton, tokenEq, FormatValue, TokenName, FormatAddress, Token, FormatBalance } from '@acala-dapp/react-components';
import { EmergencyShutdownContext } from './EmergencyShutdownProvider';
import classes from './ReclaimModal.module.scss';

const AssetBoard: FC = () => {
  const { stableCurrency } = useConstants();
  const prices = useAllPrices();
  const { collaterals } = useContext(EmergencyShutdownContext);
  const totalValue = useMemo(() => {
    if (!prices || !collaterals) return Fixed18.ZERO;

    return Object.keys(collaterals).reduce((acc, currency) => {
      const price = prices.find((i) => tokenEq(currency, i.currency));

      return acc.add(price ? price.price.mul(collaterals[currency]) : Fixed18.ZERO);
    }, Fixed18.ZERO);
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
  const { stableCurrency } = useConstants();
  const stableBalance = useBalance(stableCurrency);

  const { active } = useAccounts();
  const { collaterals, setStep, updateCollateralRef } = useContext(EmergencyShutdownContext);

  const reclaimSuccess = useCallback(() => {
    onClose();
    setStep('success');
  }, [setStep, onClose]);

  const params = useMemo(() => {
    return [stableBalance.innerToString()];
  }, [stableBalance]);

  const beforeSend = useCallback(() => {
    const copyCollaterals = Object.keys(collaterals).reduce((acc, cur) => {
      acc[cur] = Fixed18.fromNatural(collaterals[cur].toFixed(18));

      return acc;
    }, {} as Record<string, Fixed18>);

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
            beforSend={beforeSend}
            method='refundCollaterals'
            onSuccess={reclaimSuccess}
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
                    currency={currency}
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
