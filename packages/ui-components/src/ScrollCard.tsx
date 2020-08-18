import React, { FC, useMemo, Children, useRef, cloneElement, ReactElement, useState, ReactNode, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { uniqueId, debounce } from 'lodash';

import { Card, CardProps } from './Card';
import { BareProps } from './types';
import { Controller } from './Controller';
import './ScrollCard.scss';

export interface ScrollCardItemProps extends BareProps {
  key: string | number;
  instance: ReactElement;
}

const Item: FC<ScrollCardItemProps> = ({
  className,
  instance
}) => {
  return cloneElement(instance, { className: clsx('aca-scroll-card__item', className) });
};

const MIN_PAGE = 0;

interface ScrollCardProps extends CardProps {
  pageSize?: number;
  itemClassName?: string;
  children: ReactNode;
}

export const _ScrollCard: FC<ScrollCardProps> = ({ children, itemClassName, pageSize = 4, ...other }) => {
  const idRef = useRef<string>(uniqueId());
  const $rootRef = useRef<HTMLDivElement>(null);
  const [maxPage, setMaxPage] = useState<number>(MIN_PAGE);
  const currentPageRef = useRef<number>(MIN_PAGE);
  const [page, setPage] = useState<number>(MIN_PAGE);

  const content = useMemo(() => {
    return Children.map(children as ReactElement[], (item: ReactElement, index: number) => {
      return cloneElement(item, {
        className: itemClassName,
        key: `scroller-carda-${idRef.current}-${index}`
      });
    });
  }, [children, itemClassName]);

  const move = useCallback((page: number): void => {
    if (!$rootRef.current) return;

    const $root = $rootRef.current;
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const $container = $rootRef.current.querySelector('.aca-scroll-card__content')!;

    setPage(page);
    $container.scrollTo({ left: $root.clientWidth * page });
  }, [$rootRef]);

  const handlePrev = useCallback(() => {
    if (currentPageRef.current <= 0) {
      return;
    }

    currentPageRef.current -= 1;
    move(currentPageRef.current);
  }, [move]);

  const handleNext = useCallback(() => {
    if (currentPageRef.current >= maxPage) {
      return;
    }

    currentPageRef.current += 1;
    move(currentPageRef.current);
  }, [maxPage, move]);

  useEffect(() => {
    if (!$rootRef.current) return;

    const $root = $rootRef.current;
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const $container = $root.querySelector('.aca-scroll-card__content')!;

    const inner = debounce((): void => {
      const $rootWidth = $root.clientWidth;
      const $items = $root.querySelectorAll('.aca-scroll-card__item');
      const $containerWidth = Array.from($items).reduce((acc, cur) => acc + (cur.clientWidth || 0), 0);
      const page = Math.floor($containerWidth / $rootWidth);

      setMaxPage(page);
    }, 200);

    const reCalculationPage = debounce((): void => {
      const $rootWidth = $root.clientWidth;
      const scrollLeft = $container.scrollLeft;

      let page = MIN_PAGE;

      page = Math.floor(scrollLeft / $rootWidth);

      if (scrollLeft > $rootWidth * Math.floor(scrollLeft / $rootWidth)) {
        page += 1;
      }

      setPage(page);
      currentPageRef.current = page;
    }, 200);

    inner();

    window.addEventListener('resize', inner);
    window.addEventListener('resize', reCalculationPage);
    $container.addEventListener('scroll', reCalculationPage);

    return (): void => {
      window.removeEventListener('resize', inner);
      window.removeEventListener('resize', reCalculationPage);
      $container.removeEventListener('resize', reCalculationPage);
    };
  }, [children, $rootRef, setMaxPage, pageSize, move]);

  return (
    <Card
      {...other}
      className={clsx('aca-scroll-card__root', other.className)}
      contentClassName={clsx('aca-scroll-card__content', other.contentClassName)}
      header={
        (
          <>
            {other.header}
            <Controller.Group>
              <Controller
                direction='left'
                disabled={page === 0}
                onClick={handlePrev}
              />
              <Controller
                direction='right'
                disabled={page === maxPage}
                onClick={handleNext}
              />
            </Controller.Group>
          </>
        )
      }
      headerClassName='aca-scroll-card__header'
      ref={$rootRef}
    >
      <div className='aca-scroll-card__container'>
        {content}
      </div>
    </Card>
  );
};

type ScrollCardType = FC<ScrollCardProps> & { Item: typeof Item };

const ScrollCard = _ScrollCard as ScrollCardType;

ScrollCard.Item = Item;

export { ScrollCard };
