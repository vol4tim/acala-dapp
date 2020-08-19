import React, { FC, useCallback, useMemo } from 'react';
import { noop, upperFirst } from 'lodash';
import { useFormik } from 'formik';

import { BalanceInput, TxButton, numToFixed18Inner, LAMINAR_WATCHER_ADDRESS, getTokenName, FormatBalance } from '@acala-dapp/react-components';
import { useConstants, useFormValidator, useBalance } from '@acala-dapp/react-hooks';
import { Card, Select, Grid, List } from '@acala-dapp/ui-components';

import { ReactComponent as LaminarLogo } from '../../assets/laminar-logo.svg';
import classes from './AUSD.module.scss';

export const AUSD: FC = () => {
  const { stableCurrency } = useConstants();
  const stableCurrencyBalance = useBalance(stableCurrency);
  const validator = useFormValidator({
    amount: {
      currency: stableCurrency,
      type: 'balance'
    },
    channel: {
      type: 'string'
    }
  });
  const form = useFormik({
    initialValues: {
      amount: '' as any as number,
      channel: 'laminar'
    },
    onSubmit: noop,
    validate: validator
  });

  const handleInput = useCallback((amount) => {
    form.setFieldValue('amount', amount);
  }, [form]);

  const handleChannelChange = useCallback((channel) => {
    form.setFieldValue('channel', channel);
  }, [form]);

  const handleSuccess = useCallback(() => {
    form.resetForm();
  }, [form]);

  const params = useMemo(() => {
    const { amount, channel } = form.values;

    if (channel === 'laminar') {
      return [
        LAMINAR_WATCHER_ADDRESS,
        stableCurrency,
        numToFixed18Inner(amount)
      ];
    }

    return [];
  }, [form, stableCurrency]);

  const isDisabled = useMemo((): boolean => {
    if (!form.values.amount || !form.values.channel) {
      return true;
    }

    return !!form.errors.amount;
  }, [form]);

  return (
    <Card>
      <div className={classes.root}>
        <div className={classes.container}>
          <Grid container>
            <Grid item>
              <Select
                onChange={handleChannelChange}
                value={form.values.channel}
              >
                <Select.Option value='laminar'>
                  <LaminarLogo style={{ marginRight: 8 }} />
                  Laminar
                </Select.Option>
              </Select>
            </Grid>
            <Grid item>
              <p className={classes.description}>
                Transfer {getTokenName(stableCurrency)} from Acala to {upperFirst(form.values.channel)}
              </p>
            </Grid>
            <Grid item>
              <BalanceInput
                error={form.errors.amount}
                onChange={handleInput}
                token={stableCurrency}
                value={form.values.amount}
              />
              <List>
                <List.Item
                  label='Available'
                  value={(
                    <FormatBalance
                      balance={stableCurrencyBalance}
                      currency={stableCurrency}
                    />
                  )}
                />
              </List>
            </Grid>
            <Grid
              className={classes.actionArea}
              item
            >
              <TxButton
                className={classes.txBtn}
                disabled={isDisabled}
                method='transfer'
                onExtrinsicSuccess={handleSuccess}
                params={params}
                section='currencies'
              >
                Transfer
              </TxButton>
            </Grid>
          </Grid>
        </div>
      </div>
    </Card>
  );
};
