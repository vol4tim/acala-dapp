import React, { FC, memo, ReactElement, ChangeEvent } from 'react';
import { useFormik } from 'formik';
import { noop } from 'lodash';

import { TagGroup, Tag } from '@acala-dapp/ui-components';
import { TagInput } from '@acala-dapp/ui-components/TagInput';
import { useFormValidator } from '@acala-dapp/react-hooks';

import classes from './SlippageInputArea.module.scss';

interface Props {
  onChange?: (slippage: number) => void;
  slippage?: number;
}

const SLIPPAGE_MAX = 99;
const SLIPPAGE_MIN = 0;

export const SlippageInputArea: FC<Props> = memo(({ onChange, slippage = 0.005 }) => {
  const suggestValues = [0.001, 0.005, 0.01];
  const suggestedIndex = 1;
  const validator = useFormValidator({
    custom: {
      equalMax: false,
      equalMin: true,
      max: SLIPPAGE_MAX,
      min: SLIPPAGE_MIN,
      type: 'number'
    }
  });
  const form = useFormik({
    initialValues: {
      custom: (('' as any) as number)
    },
    onSubmit: noop,
    validate: validator
  });

  const handleClick = (num: number): void => {
    onChange && onChange(num);
    form.resetForm();
  };

  const renderSuggest = (num: number): string => {
    return `${num * 100}%${num === suggestValues[suggestedIndex] ? ' (suggested)' : ''}`;
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);

    if (value < SLIPPAGE_MIN) {
      onChange && onChange(SLIPPAGE_MIN / 100);
      form.setFieldValue('custom', SLIPPAGE_MIN);

      return;
    }

    if (value > SLIPPAGE_MAX) {
      onChange && onChange(SLIPPAGE_MAX / 100);
      form.setFieldValue('custom', SLIPPAGE_MAX);

      return;
    }

    onChange && onChange(value / 100);
    form.handleChange(e);
  };

  return (
    <div className={classes.root}> <p className={classes.title}>Limit addtion price slippage</p>
      <TagGroup>
        {
          suggestValues.map((suggest): ReactElement => {
            return (
              <Tag
                color={slippage === suggest ? 'primary' : 'white'}
                key={`suggest-${suggest}`}
                onClick={(): void => handleClick(suggest) }
              >
                {renderSuggest(suggest)}
              </Tag>
            );
          })
        }
        <TagInput
          error={!!form.errors.custom}
          id='custom'
          label='%'
          name='custom'
          onChange={handleInput}
          placeholder='Custom'
          value={form.values.custom}
        />
      </TagGroup>
    </div>
  );
});

SlippageInputArea.displayName = 'SlippageInputArea';
