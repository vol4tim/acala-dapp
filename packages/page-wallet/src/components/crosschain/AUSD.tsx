import React, { FC, useCallback, useMemo } from 'react';
import { noop, upperFirst } from 'lodash';
import { useFormik } from 'formik';
import { Form } from 'antd';

import { BalanceInput, TxButton, numToFixed18Inner, getTokenName, FormatBalance, UserAssetBalance } from '@acala-dapp/react-components';
import { useConstants, useFormValidator, useBalance, useAccounts, useBalanceValidator } from '@acala-dapp/react-hooks';
import { Card, Select, Grid, List } from '@acala-dapp/ui-components';

import { ReactComponent as LaminarLogo } from '../../assets/laminar-logo.svg';
import classes from './AUSD.module.scss';
import { AddressFromToInput } from './AddressFromToInput';

const FormItem = Form.Item;

export const AUSD: FC = () => {
  const { active } = useAccounts();
  const { stableCurrency } = useConstants();
  const [form] = Form.useForm();
  const balanceValidator = useBalanceValidator({
    currency: stableCurrency,
    fieldName: 'amount',
    getFieldValue: form.getFieldValue
  });

  const formLayout = useMemo(() => {
    return {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 }
    };
  }, []);

  return (
    <Card>
      <div className={classes.root}>
        <div className={classes.container}>
          <Form
            {...formLayout}
            form={form}
          >
            <FormItem
              initialValue='laminar'
              label='Transfer aUSD from Acala to Laminar'
              name='network'
            >
              <Select>
                <Select.Option value={'laminar'}>
                  <LaminarLogo />
                  <p>Laminar</p>
                </Select.Option>
              </Select>
            </FormItem>
            <FormItem
              label='Account'
              name='address'
            >
              <AddressFromToInput
                from={active?.address}
              />
            </FormItem>
            <FormItem
              extra={
                <div className={classes.amountExtra}>
                  <p>Available</p>
                  <UserAssetBalance currency={stableCurrency} />
                </div>
              }
              name='amount'
              rules={[
                {
                  validator: balanceValidator
                }
              ]}
            >
              <BalanceInput token={stableCurrency} />
            </FormItem>
          </Form>
        </div>
      </div>
    </Card>
  );
};
