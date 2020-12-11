import React, { FC, ReactElement, useContext, useCallback, useState } from 'react';

import { TagGroup, Tag } from '@acala-dapp/ui-components';
import { TagInput } from '@acala-dapp/ui-components/TagInput';

import classes from './SlippageInput.module.scss';
import { SwapContext } from './SwapProvider';
import { FixedPointNumber } from '@acala-network/sdk-core';

const SLIPPAGE_MAX = 50;
const SLIPPAGE_MIN = 0;
const SUGGEST_VALUES = [0.001, 0.005, 0.01];
const SUGGESTED_INDEX = 1; // suggest slippage positions

export const SlippageInput: FC = () => {
  const { updateUserInput, userInput } = useContext(SwapContext);
  const [custom, setCustom] = useState<number>(0);

  const handleClick = useCallback((num: number): void => {
    updateUserInput({
      acceptSlippage: new FixedPointNumber(num),
      updateOrigin: 'outset'
    });
  }, [updateUserInput]);

  const renderSuggest = useCallback((num: number): string => {
    return `${num * 100}%${num === SUGGEST_VALUES[SUGGESTED_INDEX] ? ' (suggested)' : ''}`;
  }, []);

  const handleInput = useCallback((_value: number | string): void => {
    const value = Number(_value);

    setCustom(value);
    updateUserInput({
      acceptSlippage: new FixedPointNumber(value / 100),
      updateOrigin: 'outset'
    });
  }, [updateUserInput, setCustom]);

  return (
    <div className={classes.root}> <p className={classes.title}>Limit addtion price slippage</p>
      <TagGroup>
        {
          SUGGEST_VALUES.map((suggest): ReactElement => {
            return (
              <Tag
                key={`suggest-${suggest}`}
                onClick={(): void => handleClick(suggest) }
                style={userInput.acceptSlippage.isEqualTo(new FixedPointNumber(suggest)) ? 'primary' : 'normal'}
              >
                {renderSuggest(suggest)}
              </Tag>
            );
          })
        }
        <TagInput
          id='custom'
          label='%'
          max={SLIPPAGE_MAX}
          min={SLIPPAGE_MIN}
          name='custom'
          onChange={handleInput}
          placeholder='Custom'
          value={custom}
        />
      </TagGroup>
    </div>
  );
};
