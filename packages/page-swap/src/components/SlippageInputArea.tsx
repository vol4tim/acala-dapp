import React, { FC, ReactElement, useContext, useCallback, useState, useMemo } from 'react';

import { TagGroup, Tag } from '@acala-dapp/ui-components';
import { TagInput } from '@acala-dapp/ui-components/TagInput';

import classes from './SlippageInputArea.module.scss';
import { SwapContext } from './SwapProvider';

const SLIPPAGE_MAX = 50;
const SLIPPAGE_MIN = 0;

export const SlippageInputArea: FC = () => {
  const { setSlippage, slippage } = useContext(SwapContext);
  const [custom, setCustom] = useState<number>(0);
  const suggestValues = useMemo(() => [0.001, 0.005, 0.01], []);
  const suggestedIndex = 1;

  const handleClick = useCallback((num: number): void => {
    setSlippage(num);
  }, [setSlippage]);

  const renderSuggest = useCallback((num: number): string => {
    return `${num * 100}%${num === suggestValues[suggestedIndex] ? ' (suggested)' : ''}`;
  }, [suggestValues]);

  const handleInput = useCallback((_value: number | string): void => {
    const value = Number(_value);

    setCustom(value);
    setSlippage(value / 100);
  }, [setSlippage, setCustom]);

  return (
    <div className={classes.root}> <p className={classes.title}>Limit addtion price slippage</p>
      <TagGroup>
        {
          suggestValues.map((suggest): ReactElement => {
            return (
              <Tag
                key={`suggest-${suggest}`}
                onClick={(): void => handleClick(suggest) }
                style={slippage === suggest ? 'primary' : 'normal'}
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
