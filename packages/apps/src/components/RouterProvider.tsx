import React, { FC, cloneElement, ReactElement } from 'react';
// FIXME: should remove ts-ignore when react-router@6 is avaliable
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { BrowserRouter, useRoutes } from 'react-router-dom';

import { RouterConfigData } from '../router-config';

interface Props {
  config: RouterConfigData[];
}

const Routes: FC<Props> = ({ config }) => {
  const element = useRoutes(config);

  return element;
};

export const RouterProvider: FC<Props> = ({ config }) => {
  config.forEach((item) => {
    if (item.children) {
      item.element = cloneElement(item.element as ReactElement, { children: <Routes config={item.children} /> });
    }
  });

  return (
    <BrowserRouter>
      <Routes config={config} />
    </BrowserRouter>
  );
};
