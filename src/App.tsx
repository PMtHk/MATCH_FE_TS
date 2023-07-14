import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Linear from 'components/loading/Linear';

// snackbar
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';

// redux
import { RootState } from 'store';
import { snackbarActions } from 'store/snackbar-slice';

// firebase
import './firebase';
import NotFound from 'components/errorFallback/NotFound';

// lazy loading
const LandingPage = lazy(() => import('pages/landing'));

const LoginPage = lazy(() => import('pages/login'));
const LoginRedirect = lazy(() => import('pages/login/redirect'));

const Register = lazy(() => import('pages/register/index'));
const Terms = lazy(() => import('pages/register/Terms'));
const Games = lazy(() => import('pages/register/Games'));
const SetFavoriteGame = lazy(() => import('pages/register/SetFavGame'));

const MyPage = lazy(() => import('pages/mypage'));
const LeagueOfLegends = lazy(() => import('pages/leagueoflegends'));

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

  const snackbarClose = () => {
    dispatch(snackbarActions.CLOSE_SNACKBAR());
  };

  return (
    <Suspense fallback={<Linear height="100vh" text="MatchGG 불러오는 중" />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/kakao/login" element={<LoginRedirect />} />
        <Route path="/kakao/register/*" element={<Register />}>
          <Route path="" element={<Terms />} />
          <Route path="games" element={<Games />} />
          <Route path="favgame" element={<SetFavoriteGame />} />
        </Route>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/lol/*" element={<LeagueOfLegends />} />
        <Route path="*" element={<NotFound />} />
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
