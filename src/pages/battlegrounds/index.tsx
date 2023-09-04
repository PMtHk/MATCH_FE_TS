import React from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';

import Review from 'components/Review';
import AuthHoc from 'hoc/AuthHoc';
import Main from './main';
import CardDetail from './CardDetail';
import CreateCard from './CreateCard';
import EditCard from './EditCard';

const AuthCreateCard = AuthHoc(CreateCard, true);
const AuthEditCard = AuthHoc(EditCard, true);
const AuthReview = AuthHoc(Review, true);

const Battlegrounds = () => {
  const location = useLocation();
  const background = '/pubg';

  return (
    <>
      <Routes location={background}>
        <Route path="/*" element={<Main />}>
          <Route path="new" element={<AuthCreateCard />} />
          <Route path=":id" element={<CardDetail />} />
          <Route path=":id/edit" element={<AuthEditCard />} />
          <Route path=":id/review" element={<AuthReview />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="new" element={<AuthCreateCard />} />
          <Route path=":id" element={<CardDetail />} />
          <Route path=":id/edit" element={<AuthEditCard />} />
          <Route path=":id/review" element={<AuthReview />} />
        </Routes>
      )}
    </>
  );
};

export default Battlegrounds;
