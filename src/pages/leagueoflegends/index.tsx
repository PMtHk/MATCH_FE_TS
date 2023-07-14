import React from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';

import Main from './main';
import CardDetail from './CardDetail';
import CreateCard from './CreateCard';
import EditCard from './EditCard';

const LeagueOfLegends = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/*" element={<Main />}>
          <Route path="new" element={<CreateCard />} />
          <Route path=":id" element={<CardDetail />} />
          <Route path=":id/edit" element={<EditCard />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="new" element={<CreateCard />} />
          <Route path=":id" element={<CardDetail />} />
          <Route path=":id/edit" element={<EditCard />} />
        </Routes>
      )}
    </>
  );
};

export default LeagueOfLegends;
