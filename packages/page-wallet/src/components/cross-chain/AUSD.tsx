import React, { FC, useCallback, useMemo } from 'react';
import { Form } from 'antd';

import { BalanceInput, TxButton, numToFixed18Inner, UserAssetBalance } from '@acala-dapp/react-components';
import { useConstants, useAccounts, useBalanceValidator, useAddressValidator } from '@acala-dapp/react-hooks';
import { Card, Select } from '@acala-dapp/ui-components';

import { ReactComponent as LaminarLogo } from '../../assets/laminar-logo.svg';
import classes from './AUSD.module.scss';
import { AddressToInput } from './AddressInput';

const FormItem = Form.Item;

const parachainIdsMap = new Map<string, number>([
  ['laminar', 5001],
  ['acala', 500]
]);

export const AUSD: FC = () => {
  const { active } = useAccounts();
  const { stableCurrency } = useConstants();
  const [form] = Form.useForm();

  const balanceValidator = useBalanceValidator({
    currency: stableCurrency,
    fieldName: 'amount',
    getFieldValue: form.getFieldValue
  });

  const addressValidator = useAddressValidator({
    fieldName: 'address',
    getFieldVaule: form.getFieldValue,
    required: true
  });

  const formLayout = useMemo(() => {
    return {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 }
    };
  }, []);

  const getParams = useCallback((): any[] => {
    const values = form.getFieldsValue();

    return [stableCurrency, parachainIdsMap.get(values.network), values.address, numToFixed18Inner(values.amount)];
  }, [form, stableCurrency]);

  const preCheck = useCallback(async (): Promise<boolean> => {
    try {
      await form.validateFields();
    } catch (e) {
      return false;
    }

    return true;
  }, [form]);

  const handleSuccess = useCallback(() => {
    form.resetFields();
  }, [form]);

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
              rules={[{ validator: addressValidator }]}
            >
              <AddressToInput from={active?.address} />
            </FormItem>
            <FormItem
              extra={
                <div className={classes.amountExtra}>
                  <p>Available</p>
                  <UserAssetBalance
                    currency={stableCurrency}
                    showCurrency
                  />
                </div>
              }
              name='amount'
              rules={[
                {
                  message: 'Please Input Amount',
                  required: true
                },
                {
                  validator: balanceValidator
                }
              ]}
            >
              <BalanceInput token={stableCurrency} />
            </FormItem>
            <TxButton
              className={classes.txBtn}
              method='transferToParachain'
              onExtrinsicSuccess={handleSuccess}
              params={getParams}
              preCheck={preCheck}
              section='xTokens'
            >
              Transfer
            </TxButton>
          </Form>
        </div>
      </div>
    </Card>
  );
};
