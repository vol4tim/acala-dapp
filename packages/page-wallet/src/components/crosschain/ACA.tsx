import React, { FC, useCallback, useMemo } from 'react';
import { Form } from 'antd';

import { BalanceInput, TxButton, numToFixed18Inner, UserAssetBalance } from '@acala-dapp/react-components';
import { useConstants, useAccounts, useBalanceValidator, useAddressValidator, useApi } from '@acala-dapp/react-hooks';
import { Card, Select } from '@acala-dapp/ui-components';

import { ReactComponent as PhalaLoogo } from '../../assets/phala.svg';
import classes from './AUSD.module.scss';
import { AddressToInput } from './AddressInput';

const FormItem = Form.Item;

const parachainIdsMap = new Map<string, number>([
  ['phala', 2000],
  ['acala', 5000]
]);

export const ACA: FC = () => {
  const { api } = useApi();
  const { active } = useAccounts();
  const { nativeCurrency } = useConstants();
  const [form] = Form.useForm();

  const balanceValidator = useBalanceValidator({
    currency: nativeCurrency,
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

    return [
      {
        chain_id: {
          ParaChain: 5000,
        },
        currency_id: 'ACA'
      },
      parachainIdsMap.get(values.network),
      values.address,
      'Any',
      numToFixed18Inner(values.amount)
    ];
  }, [form, nativeCurrency, api]);

  console.log(getParams());

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
              initialValue='phala'
              label='Transfer ACA from Acala to Phala'
              name='network'
            >
              <Select>
                <Select.Option value={'phala'}>
                  <PhalaLoogo style={{ filter: 'invert(1)' }} />
                  <p>Phala</p>
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
                    currency={nativeCurrency}
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
              <BalanceInput token={nativeCurrency} />
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
