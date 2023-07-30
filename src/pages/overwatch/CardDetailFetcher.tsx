import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { cardActions } from 'store/card-slice';
import { fetchCardDetail } from 'apis/api/overwatch';

interface CardDetailFetcherProps {
  children: React.ReactNode;
}

const CardDetailFetcher = ({ children }: CardDetailFetcherProps) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { id: cardId } = params;

  const cardDetail: any = fetchCardDetail(`/api/overwatch/boards/${cardId}`);

  useEffect(() => {
    dispatch(cardActions.SET_CURRENT_CARD(cardDetail));
  }, [cardDetail, dispatch]);

  return <div>{children}</div>;
};

export default CardDetailFetcher;
