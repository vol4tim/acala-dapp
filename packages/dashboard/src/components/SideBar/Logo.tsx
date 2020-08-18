import React, { FC } from 'react';

import { ReactComponent as MandalaIogo } from '../../assets/acala-mandala-logo.svg';
import classes from './Sidebar.module.scss';

export const Logo: FC = () => {
  return (
    <div className={classes.logo}>
      <MandalaIogo/>
    </div>
  );
};
