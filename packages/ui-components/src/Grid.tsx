import React, { FC } from 'react';
import { Grid as MuiGrid, GridProps } from '@material-ui/core';

interface Props extends GridProps{
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export const Grid: FC<Props> = ({ children, spacing = 3, ...other }) => {
  const props: GridProps = other;

  if (props.container) {
    props.spacing = spacing;
  }

  if (props.container && props.item) {
    const { item, lg, md, xs, ...other } = props;

    return (
      <MuiGrid item={item}
        lg={lg}
        md={md}
        xs={xs}>
        <MuiGrid {...other}>{children}</MuiGrid>
      </MuiGrid>
    );
  }

  return <MuiGrid {...props}>{children}</MuiGrid>;
};
