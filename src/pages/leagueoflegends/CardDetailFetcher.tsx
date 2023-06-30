import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useErrorBoundary } from 'react-error-boundary';

import { cardActions } from 'store/card-slice';
import CardDetailContainer from './CardDetailContainer';

// interface CardDetailFetcherProps {
//   children: React.ReactNode;
// }

const CardDetailFetcher = () => {
  const dispatch = useDispatch();

  const params = useParams();
  const { id: cardId } = params;

  return <CardDetailContainer />;
};

export default CardDetailFetcher;
