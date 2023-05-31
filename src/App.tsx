import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import Linear from 'components/loading/Linear';

// lazy loading
const LandingPage = lazy(() => import('pages/LandingPage'));

const LoginPage = lazy(() => import('pages/LoginPage'));
const LoginRedirect = lazy(() => import('pages/LoginPage/redirect'));

const Register = lazy(() => import('pages/RegisterPage/index'));
const Terms = lazy(() => import('pages/RegisterPage/Terms'));
const Games = lazy(() => import('pages/RegisterPage/Games'));

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
          <Route path="representative" element={<>representative</>} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
