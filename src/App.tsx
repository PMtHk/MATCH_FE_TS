import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingPage from 'pages/LandingPage';
import LoginPage from 'pages/LoginPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
