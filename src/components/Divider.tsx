import React from 'react';

// mui
import Grid from '@mui/material/Grid';
import MuiDivider from '@mui/material/Divider';

interface DividerProps {
  children: React.ReactNode;
}

const Divider = ({ children }: DividerProps) => {
  return (
    <Grid container alignItems="center" justifyContent="center" spacing={2}>
      <Grid item xs>
        <MuiDivider />
      </Grid>
      <Grid item>{children}</Grid>
      <Grid item xs>
        <MuiDivider />
      </Grid>
    </Grid>
  );
};

export default Divider;
