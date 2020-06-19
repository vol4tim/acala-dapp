import React, { ReactNode, MouseEvent, EventHandler, useRef, ReactElement, useCallback, useMemo } from 'react';
import clsx from 'clsx';

import { randomID } from './utils';
import { PageLoading } from './Loading';
import { BareProps } from './types';
import classes from './Table.module.scss';

type AlignType = 'left' | 'right' | 'center';

export type TableConfig = {
  key?: string;
  title: string;
  dataIndex?: string;
  width?: number;
  align?: AlignType;
  render?: (...params: any[]) => ReactNode;
};

interface RawProps<T> {
  onClick: (event: MouseEvent<HTMLTableRowElement>, data: T) => void;
}

type Props<T> = {
  border?: boolean;
  config: TableConfig[];
  data: T[];
  rawProps?: RawProps<T>;
  showHeader?: boolean;
  cellClassName?: string;
  headerCellClassName?: string;
  empty?: ReactNode;
  size?: 'small' | 'normal';
  loading?: boolean;
} & BareProps;

export function Table<T> ({
  border = false,
  cellClassName,
  className,
  config,
  data,
  empty,
  headerCellClassName,
  loading = false,
  rawProps,
  showHeader = false,
  size = 'normal'
}: Props<T>): ReactElement {
  const randomId = useRef<string>(randomID());
  const totalWidthConfiged = useMemo(() => config.reduce((acc, cur) => acc + (cur.width ? cur.width : 0), 0), [config]);
  const defaultCellWidth = useMemo(() => `${100 / config.length}%`, [config]);

  const renderItem = useCallback((config: TableConfig, data: T, index: number): ReactNode => {
    if (config.dataIndex && typeof data === 'object') {
      /* eslint-disable-next-line */
      // @ts-ignore
      return config.render ? config.render(data[config.dataIndex]) : data[config.dataIndex];
    } else {
      return config.render ? config.render(data, index) : data;
    }
  }, []);

  const renderContent = useCallback(() => {
    if (loading && !data) {
      return (
        <tr className={classes.empty}>
          <td colSpan={config.length}>
            <PageLoading />
          </td>
        </tr>
      );
    }

    if (data.length) {
      return data.map((item, index) => {
        /* eslint-disable-next-line @typescript-eslint/no-empty-function */
        let onClick: EventHandler<MouseEvent<HTMLTableRowElement>> = () => {};

        if (!item) {
          return null;
        }

        if (rawProps && rawProps.onClick) {
          onClick = (event): void => rawProps.onClick(event, item);
        }

        return (
          <tr
            className={classes.row}
            key={`table-body-${index}`}
            {...rawProps}
            onClick={onClick}
          >
            {config.map((configData, configIndex) => (
              <td
                className={
                  clsx(
                    classes.cell,
                    classes[configData.align || 'center'],
                    cellClassName,
                    {
                      first: index === 0
                    }
                  )
                }
                key={`table-cell-${randomId.current}-${index}-${configData.key || configIndex}`}
              >
                <div>
                  {
                    renderItem(configData, item, index)
                  }
                </div>
              </td>
            ))}
          </tr>
        );
      });
    }

    if (!data.length && empty) {
      return (
        <tr className={classes.empty}>
          <td colSpan={config.length}>{empty}</td>
        </tr>
      );
    }
  }, [loading, data, empty, config, rawProps, cellClassName, renderItem]);

  return (
    <table className={clsx(classes.root, classes[size], className, { [classes.border]: border })}>
      <colgroup>
        {
          config.map((_item, index) => (
            <col
              key={`table-header-colgroup-${randomId.current}-${index}`}
              style={{ width: _item.width ? `${_item.width / totalWidthConfiged}%` : defaultCellWidth }}
            />
          ))
        }
      </colgroup>
      {
        showHeader ? (
          <thead>
            <tr>
              {config.map((item, index) => (
                <th
                  className={
                    clsx(
                      classes.headerCell,
                      classes[item.align || 'center'],
                      headerCellClassName
                    )
                  }
                  key={`table-header-${randomId.current}-${index}`}
                >
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
        ) : null
      }
      <tbody>
        {
          renderContent()
        }
      </tbody>
    </table>
  );
}
