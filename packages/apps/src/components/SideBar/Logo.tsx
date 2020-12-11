import React, { FC, useContext } from 'react';

import { UIContext, UIData, Tag } from '@acala-dapp/ui-components';

import { ReactComponent as MandalaIogo } from '../../assets/acala-mandala-logo.svg';
import { ReactComponent as MandalaIogoSmall } from '../../assets/mandala-small.svg';
import classes from './Sidebar.module.scss';

export const Logo: FC = () => {
  const ui = useContext<UIData>(UIContext);

  return (
    <div className={classes.logo}>
      {ui.breakpoint === 'md' ? <MandalaIogoSmall /> : <MandalaIogo/>}
    </div>
  );
};
