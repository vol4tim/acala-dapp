import React, { FC, cloneElement, ReactElement, useMemo, useEffect } from 'react';
// FIXME: should remove ts-ignore when react-router@6 is avaliable
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { useNavigate } from 'react-router';

import { RouterConfigData } from '../router-config';

export const Redirect: FC<{ to: string}> = ({ to }) => {
  const navigate = useNavigate();

  useEffect(() => navigate(to), [navigate, to]);

  return null;
};

interface Props {
  config: RouterConfigData[];
}

const Routes: FC<Props> = ({ config }) => {
  const _config = useMemo(() => {
    const inner = config.slice();

    inner.forEach((item) => {
      // process redirect
      if (item.redirectTo) {
        item.element = <Redirect to={item.redirectTo} />;
      }
    });

    return inner;
  }, [config]);
  const element = useRoutes(_config);

  return element;
};

export const RouterProvider: FC<Props> = ({ config }) => {
  const _config = useMemo<RouterConfigData[]>(() => {
    const inner = config.slice();

    inner.forEach((item) => {
      // process second level route
      if (item.children) {
        item.element = cloneElement(item.element as ReactElement, { children: <Routes config={item.children} /> });
      }

      // process redirect
      if (item.redirectTo) {
        item.element = <Redirect to={item.redirectTo} />;
      }
    });

    return inner;
  }, [config]);

  return (
    <BrowserRouter>
      <Routes config={_config} />
    </BrowserRouter>
  );
};
