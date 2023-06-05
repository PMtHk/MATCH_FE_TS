import React from 'react';
import { Outlet } from 'react-router-dom';

// mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// mui styled components
import { styled } from '@mui/material/styles';

const Wrapper = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '100vh',
  padding: '10px 0 10px',
  [theme.breakpoints.up('sm')]: {
    margin: '25px auto',
    height: 'calc(100vh - 50px)',
    minHeight: '560px',
    border: '1px solid #dddddd',
    borderRadius: '8px',
  },
})) as typeof Container;

const LogoTitle = styled(Typography)(({ theme }) => ({
  fontSize: '32px',
  fontStyle: 'italic',
  fontWeight: 700,
  [theme.breakpoints.up('sm')]: {
    fontSize: '44px',
  },
})) as typeof Typography;

const Register = () => {
  return (
    <Wrapper maxWidth="sm">
      <LogoTitle>MatchGG</LogoTitle>
      <Outlet />
    </Wrapper>
  );
};

export default Register;
