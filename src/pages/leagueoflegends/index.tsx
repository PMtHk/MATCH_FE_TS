import { useLocation, Route, Routes } from 'react-router-dom';

import Review from 'components/Review';
import Main from './main';
import CreateCard from './CreateCard';
import CardDetail from './CardDetail';
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

export default LeagueOfLegends;
