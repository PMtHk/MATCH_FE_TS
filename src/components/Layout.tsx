import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// mui
import styled from '@mui/system/styled';
import MuiBox from '@mui/material/Box';
import MuiContainer from '@mui/material/Container';
import MuiTypography from '@mui/material/Typography';

import { useSelector } from 'react-redux';
import { RootState } from 'store';

import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';

import Header from './header';
import Footer from './Footer';

import { gameList, GAME_ID, GAME } from '../assets/Games.data';

const Layout = () => {
  const { isLogin } = useSelector((state: RootState) => state.user);

  // 알림 권한 허용, 토큰 발급
  const getPermission = () => {
    console.log('알림 권한 요청중...');
    if ('serviceWorker' in navigator) {
      console.log('서비스 워커 안잡힘...');
    }

    Notification.requestPermission().then(async (permission) => {
      // 알림 허용
      if (permission === 'granted') {
        console.log('알림 허용됨 -> 토큰 발급 시도하겠음');
        const token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        }).catch((error: any) => console.log(error));
        if (token) {
          console.log(`토큰 : ${token}`);
        } else {
          console.log('토큰 없음...');
        }
      }
    });
  };

  useEffect(() => {
    if (isLogin) {
      getPermission();
    }
  }, [isLogin]);

  return (
    <LayoutContainer>
      <Header />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;

// styled-components
const LayoutContainer = styled(MuiBox)(() => ({
  width: '100%',
  backgroundColor: '#f3f3f3',
})) as typeof MuiBox;

const GameTypo = styled(MuiTypography)(({ theme }) => ({
  fontSize: 32,
  textAlign: 'center',
  fontStyle: 'italic',
  fontWeight: '600',
  margin: '0 20px 20px 20px',
  [theme.breakpoints.up('sm')]: {
    fontSize: 48,
  },
  [theme.breakpoints.up('md')]: {
    fontSize: 56,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 64,
  },
})) as typeof MuiTypography;

const ContentWrapper = styled(MuiContainer)(() => ({
  padding: '120px 0 0 0',
  minHeight: 'calc(100vh)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  backgroundColor: '#f3f3f3',
})) as typeof MuiContainer;
