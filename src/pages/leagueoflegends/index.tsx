import React from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';

import Main from './main';

const LeagueOfLegends = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/*" element={<Main />} />
        <Route path=":id" element={<div>a</div>} />
      </Routes>
      {background && (
        <Routes>
          <Route path=":id" element={<div>cardDetail</div>} />
        </Routes>
      )}
    </>
  );
};

export default LeagueOfLegends;
