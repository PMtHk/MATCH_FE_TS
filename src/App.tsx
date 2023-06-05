import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import Linear from 'components/loading/Linear';

// lazy loading
const LandingPage = lazy(() => import('pages/landing'));

const LoginPage = lazy(() => import('pages/login'));
const LoginRedirect = lazy(() => import('pages/login/redirect'));

const Register = lazy(() => import('pages/register/index'));
const Terms = lazy(() => import('pages/register/Terms'));
const Games = lazy(() => import('pages/register/Games'));
const SetFavoriteGame = lazy(() => import('pages/register/SetFavGame'));

const App = () => {
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
      </Routes>
    </Suspense>
  );
};

export default App;
