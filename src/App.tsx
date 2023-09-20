import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Linear from 'components/loading/Linear';

// snackbar
import { Snackbar, Alert } from '@mui/material';

// redux
import { RootState } from 'store';
import { snackbarActions } from 'store/snackbar-slice';

// firebase
import './firebase';

import NotFound from 'components/errorFallback/NotFound';
import Layout from 'components/Layout';

import LeagueOfLegends from 'pages/leagueoflegends';
import Battlegrounds from 'pages/battlegrounds';
import Overwatch from 'pages/overwatch';
import Valorant from 'pages/valorant';
import MyPage from 'pages/mypage';

import AuthHoc from 'hoc/AuthHoc';
import RsoCallback from 'pages/mypage/RsoCallback';
/*
 * option: null: 아무나 출입이 가능한 페이지
 * option: true: 로그인한 유저만 출입이 가능한 페이지
 * option: false: 로그인한 유저는 출입이 불가능한 페이지
 * adminRoute: true: 관리자만 출입이 가능한 페이지
 */

// lazy loading
const LandingPage = lazy(() => import('pages/landing'));

const LoginPage = lazy(() => import('pages/login'));
const AdminLoginPage = lazy(() => import('pages/login/AdminLogin'));
const LoginRedirect = lazy(() => import('pages/login/redirect'));

const Register = lazy(() => import('pages/register/index'));
const Terms = lazy(() => import('pages/register/Terms'));
const Games = lazy(() => import('pages/register/Games'));
const SetFavoriteGame = lazy(() => import('pages/register/SetFavGame'));

const AuthLoginPage = AuthHoc(LoginPage, false);
const AuthAdminLoginPage = AuthHoc(AdminLoginPage, null);
const AuthRegister = AuthHoc(Register, false);
const AuthMyPage = AuthHoc(MyPage, true);

const App = () => {
  const dispatch = useDispatch();

  const SHOW_SNACKBAR = useSelector(
    (state: RootState) => state.snackbar.toggleSnackbar,
  );
  const MESSAGE = useSelector(
    (state: RootState) => state.snackbar.snackbarMessage,
  );
  const SEVERITY = useSelector(
    (state: RootState) => state.snackbar.snackbarSeverity,
  );
  const { isLogin, representative } = useSelector(
    (state: RootState) => state.user,
  );

  const snackbarClose = () => {
    dispatch(snackbarActions.CLOSE_SNACKBAR());
  };

  return (
    <Suspense fallback={<Linear height="100vh" text="MatchGG 불러오는 중" />}>
      <Routes>
        <Route
          path="/"
          element={
            isLogin ? <Navigate to={`/${representative}`} /> : <LandingPage />
          }
        />
        <Route path="/login" element={<AuthLoginPage />} />
        <Route path="/login/admin" element={<AuthAdminLoginPage />} />
        <Route path="/kakao/login" element={<LoginRedirect />} />
        <Route path="/kakao/register/*" element={<AuthRegister />}>
          <Route path="" element={<Terms />} />
          <Route path="games" element={<Games />} />
          <Route path="favgame" element={<SetFavoriteGame />} />
        </Route>
        <Route path="*" element={<Layout />}>
          <Route path="mypage" element={<AuthMyPage />} />
          <Route path="lol/*" element={<LeagueOfLegends />} />
          <Route path="pubg/*" element={<Battlegrounds />} />
          <Route path="overwatch/*" element={<Overwatch />} />
          <Route path="valorant/*" element={<Valorant />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/mypage/rso/callback" element={<RsoCallback />} />
      </Routes>
      <Snackbar
        open={SHOW_SNACKBAR}
        onClose={snackbarClose}
        autoHideDuration={5000}
      >
        <Alert
          onClose={snackbarClose}
          severity={SEVERITY}
          sx={{ width: '100%' }}
        >
          {MESSAGE}
        </Alert>
      </Snackbar>
    </Suspense>
  );
};

export default App;
