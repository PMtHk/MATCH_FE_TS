import React from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';

import Header from '../../components/header';

const LeagueOfLegends = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      <Routes location={background || location}>
        <Route
          path="/*"
          element={
            <>
              <Header game="lol" />
              aa aa
            </>
          }
        />
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
