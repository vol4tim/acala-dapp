import React, { ReactNode, FocusEventHandler, ReactElement, cloneElement, useCallback, useMemo } from 'react';
import { useModal } from '@acala-dapp/react-hooks';
import clsx from 'clsx';

import classes from './AutoComplete.module.scss';
import { Condition } from './Condition';
import { ArrowDownIcon } from './Icon';
import { ClickAwayListener } from '@material-ui/core';

interface AutoCompleteProps {
  value?: string;
  options: string[];
  optionClassName: string;
  renderOptions: (data: string) => ReactNode;
  renderInput: () => ReactElement;
  onSelect: (value: string) => void;
}

export function AutoComplete (props: AutoCompleteProps): JSX.Element {
  const { onSelect, optionClassName, options, renderInput, renderOptions, value } = props;
  const { close: closeSuggest, open: openSuggest, status: suggestStatus } = useModal();

  const _options = useMemo(() => {
    if (!value) return options;

    return options.filter((item: string) => item.toLocaleLowerCase().startsWith(value.toLocaleLowerCase()));
  }, [options, value]);

  const onFocus: FocusEventHandler<HTMLInputElement> = useCallback(() => {
    openSuggest();
  }, [openSuggest]);

  const _onSelect = (value: string): void => {
    onSelect(value);
    closeSuggest();
  };

  const suffix = useMemo(() => {
    return (
      <ArrowDownIcon onClick={openSuggest} />
    );
  }, [openSuggest]);

  return (
    <ClickAwayListener onClickAway={closeSuggest}>
      <div className={classes.root}>
        {cloneElement(renderInput(), { onFocus, suffix })}
        <Condition condition={!!options.length}>
          <ul className={clsx(classes.list, { [classes.open]: suggestStatus })}>
            {
              _options && _options.map((item, index) => (
                <li className={clsx(optionClassName, classes.item)}
                  key={`auto-complete-${index}`}
                  onClick={(): void => _onSelect(item)}
                >{renderOptions(item)}</li>)
              )
            }
          </ul>
        </Condition>
      </div>
    </ClickAwayListener>
  );
}
