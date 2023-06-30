import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useErrorBoundary } from 'react-error-boundary';

import { useGetData } from 'useGetData';
import { cardActions } from 'store/card-slice';
import CardDetailContainer from './CardDetailContainer';

// interface CardDetailFetcherProps {
//   children: React.ReactNode;
// }

const CardDetailFetcher = () => {
  const dispatch = useDispatch();

  const params = useParams();
  const { id: cardId } = params;

  if (cardId) {
    const response: any = useGetData(`/api/lol/boards/${cardId}`);
  }

  return <CardDetailContainer />;
};

export default CardDetailFetcher;
