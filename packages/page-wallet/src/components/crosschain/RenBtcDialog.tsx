import React, { FC, useContext, useCallback } from 'react';
import clsx from 'clsx';
import axios from 'axios';

import { Dialog, Button, Grid, List, message } from '@acala-dapp/ui-components';
import { TokenImage, FormatBalance } from '@acala-dapp/react-components';
import { useAccounts } from '@acala-dapp/react-hooks';

import { RenBtcMintContext } from './RenBtcContext';
import classes from './RenBtc.module.scss';
import { ReactComponent as DepositSuccessIcon } from '../../assets/deposit-success.svg';
import { WalletContext } from '../WalletContext';

export interface RenBtcDialogProps {
  show: boolean;
  btcAddress: string;
  amount: number;
  btcTxFee: number;
  renNetworkFee: number;
}

interface AddressBar {
  address: string;
  amount: number;
}

const AddressBar: FC<AddressBar> = ({
  address,
  amount
}) => {
  return (
    <div className={clsx(classes.bar, classes.send)}>
      <TokenImage
        className={classes.icon}
        currency={'BTC'}
      />
      <div>Deposit {amount} BTC To</div>
      <div>{address}</div>
    </div>
  );
};

const BtcAddressContent: FC<Omit<RenBtcDialogProps, 'show'>> = ({
  amount,
  btcAddress,
  btcTxFee,
  renNetworkFee
}) => {
  const { setStep } = useContext(RenBtcMintContext);
  const { active } = useAccounts();

  const handleNext = useCallback(() => {
    if (!active) return;

    axios.post(
      'https://apps.acala.network/faucet/ren',
      { address: active.address },
      {
        headers: { 'Content-Type': 'application/json' }
      }).then((result) => {
      if (result.data === 'LIMIT') {
        return message.error('Reached quota');
      }

      if (result.data === 'ERROR') {
        return message.error('Unknown Error');
      }

      message.info('Success');
    });

    setStep('success');
  }, [setStep, active]);

  return (
    <Grid
      className={classes.sendDialog}
      container
    >
      <Grid item>
        <AddressBar
          address={btcAddress}
          amount={amount}
        />
      </Grid>
      <Grid item>
        <p style={{ fontSize: 16, fontWeight: 'bold' }}>For testnet purpose, renBTC is minted from faucet. RenVM will be used upon mainnet launch.</p>
        <p style={{ color: 'var(--text-color-second)', fontSize: 14 }}>Quota: max 1 renBTC / month</p>
      </Grid>
      <Grid item>
        <Button
          className={classes.btn}
          color='primary'
          onClick={handleNext}
        >
          Get test renBTC from Faucet
        </Button>
      </Grid>
      <Grid item>
        <List>
          <List.Item
            label='Integrator'
            value='apps.acala.network'
          />
          <List.Item
            label='BTC Fees'
            value={(
              <FormatBalance
                balance={btcTxFee}
                currency={'BTC'}
              />
            )}
          />
          <List.Item
            label='RenVM Network Fees'
            value={(
              <FormatBalance
                balance={renNetworkFee}
                currency={'BTC'}
              />
            )}
          />
        </List>
      </Grid>
    </Grid>
  );
};

const SuccessBar: FC = () => {
  return (
    <div className={clsx(classes.bar, classes.send)}>
      <DepositSuccessIcon className={classes.icon} />
      <div>Deposit received</div>
      <div>Bitcoin Transaction-Acala Transaction</div>
    </div>
  );
};

const SuccessContent: FC<Omit<RenBtcDialogProps, 'show'>> = ({
  btcTxFee,
  renNetworkFee
}) => {
  const { changeTab } = useContext(WalletContext);

  const handleNext = useCallback(() => {
    changeTab('acala');
  }, [changeTab]);

  return (
    <Grid
      className={classes.sendDialog}
      container
    >
      <Grid item>
        <SuccessBar />
      </Grid>
      <Grid item>
        <Button
          className={classes.btn}
          color='primary'
          onClick={handleNext}
        >
          Return
        </Button>
      </Grid>
      <Grid item>
        <List>
          <List.Item
            label='Integrator'
            value='apps.acala.network'
          />
          <List.Item
            label='BTC Fees'
            value={(
              <FormatBalance
                balance={btcTxFee}
                currency={'BTC'}
              />
            )}
          />
          <List.Item
            label='RenVM Network Fees'
            value={(
              <FormatBalance
                balance={renNetworkFee}
                currency={'BTC'}
              />
            )}
          />
        </List>
      </Grid>
    </Grid>
  );
};

export const RenBtcDialog: FC<RenBtcDialogProps> = ({
  show,
  ...props
}) => {
  const { setStep, step } = useContext(RenBtcMintContext);

  return (
    <Dialog
      action={null}
      className={classes.dialog}
      onCancel={(): void => setStep('confirm')}
      title='Deposit BTC'
      visiable={show}
      withClose
    >
      {step === 'send' ? <BtcAddressContent {...props}/> : null}
      {step === 'success' ? <SuccessContent {...props}/> : null}
    </Dialog>
  );
};
