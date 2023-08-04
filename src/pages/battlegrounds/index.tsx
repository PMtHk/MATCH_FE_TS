import React from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';
import Review from 'components/Review';

import Main from './main';
import CardDetail from './CardDetail';
import CreateCard from './CreateCard';
import EditCard from './EditCard';

const Battlegrounds = () => {
  const location = useLocation();
  const background = '/pubg';

  return (
    <>
      <Routes location={background}>
        <Route path="/*" element={<Main />}>
          <Route path="new" element={<CreateCard />} />
          <Route path=":id" element={<CardDetail />} />
          <Route path=":id/edit" element={<EditCard />} />
          <Route path=":id/review" element={<Review />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="new" element={<CreateCard />} />
          <Route path=":id" element={<CardDetail />} />
          <Route path=":id/edit" element={<EditCard />} />
          <Route path=":id/review" element={<Review />} />
        </Routes>
      )}
    </>
  );
};

export default Battlegrounds;
