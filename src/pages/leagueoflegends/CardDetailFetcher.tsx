import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { cardActions } from 'store/card-slice';
import { fetchCardDetail } from 'apis/api/leagueoflegends';
import { RootState } from 'store';

interface CardDetailFetcherProps {
  children: React.ReactNode;
}

const CardDetailFetcher = ({ children }: CardDetailFetcherProps) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { id: cardId } = params;

  const cardDetail: any = fetchCardDetail(`/api/lol/boards/${cardId}`);

  useEffect(() => {
    dispatch(cardActions.SET_CURRENT_CARD(cardDetail));
  }, [cardDetail, dispatch]);

  return <div>{children}</div>;
};

export default CardDetailFetcher;
