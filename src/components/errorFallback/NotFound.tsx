import React from 'react';
import { useNavigate } from 'react-router-dom';

// mui
import styled from '@mui/system/styled';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiButton from '@mui/material/Button';

import Layout from 'components/Layout';

const NotFound = () => {
  const navigate = useNavigate();

  const hanldeGoBackBtn = () => {
    navigate(-1);
  };

  return (
    <Layout currentGame={null}>
      <Container>
        <ErrorCodeTypo>404</ErrorCodeTypo>
        <OverwriteTypo>PAGE NOT FOUND</OverwriteTypo>
        <ErrorTypo>페이지를 찾을 수 없습니다.</ErrorTypo>
        <GoHomeBtn variant="outlined" onClick={hanldeGoBackBtn}>
          뒤로가기
        </GoHomeBtn>
      </Container>
    </Layout>
  );
};
export default NotFound;

const Container = styled(MuiBox)(() => ({
  width: '80%',
  height: '90%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const ErrorCodeTypo = styled(MuiTypography)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: '100px',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '120px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '160px',
  },
  color: '#cac9c9',
  fontFamily: 'Pangolin',
})) as typeof MuiTypography;

const OverwriteTypo = styled(MuiTypography)(({ theme }) => ({
  position: 'relative',
  fontWeight: 900,
  [theme.breakpoints.down('sm')]: {
    top: '-66px',
    fontSize: '28px',
  },
  [theme.breakpoints.up('sm')]: {
    top: '-76px',
    fontSize: '32px',
  },
  [theme.breakpoints.up('md')]: {
    top: '-100px',
    fontSize: '40px',
  },
})) as typeof MuiTypography;

const ErrorTypo = styled(MuiTypography)(({ theme }) => ({
  position: 'relative',
  fontWeight: 700,
  [theme.breakpoints.down('sm')]: {
    top: '-60px',
    fontSize: '16px',
  },
  [theme.breakpoints.up('sm')]: {
    top: '-80px',
    fontSize: '18px',
  },
  [theme.breakpoints.up('md')]: {
    top: '-100px',
    fontSize: '20px',
  },
})) as typeof MuiTypography;

const GoHomeBtn = styled(MuiButton)(({ theme }) => ({
  position: 'relative',
  fontWeight: 900,
  [theme.breakpoints.down('sm')]: {
    top: '-48px',
    width: '100px',
    height: '30px',
  },
  [theme.breakpoints.up('sm')]: {
    top: '-60px',
    width: '120px',
    height: '32px',
  },
  [theme.breakpoints.up('md')]: {
    top: '-80px',
    width: '140px',
    height: '36px',
  },
  '&:hover': {
    backgroundColor: 'primary.light',
  },
})) as typeof MuiButton;
