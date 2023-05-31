import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import Linear from 'components/loading/Linear';

// lazy loading
const LandingPage = lazy(() => import('pages/LandingPage'));
const LoginPage = lazy(() => import('pages/LoginPage'));
const LoginRedirect = lazy(() => import('pages/LoginPage/redirect'));
const Register = lazy(() => import('pages/RegisterPage/'));
const Term = lazy(() => import('pages/RegisterPage/term'));

const App = () => {
  return (
    <Suspense fallback={<Linear height="100vh" text="MatchGG 불러오는 중" />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/kakao/login" element={<LoginRedirect />} />
        <Route path="/kakao/register/*" element={<Register />}>
          <Route path="" element={<Term />} />
          <Route path="games" element={<>games</>} />
          <Route path="representative" element={<>representative</>} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
