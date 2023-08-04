import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store';
import { cardActions } from 'store/card-slice';
import { fetchCardDetail } from 'apis/api/overwatch';

interface CardDetailFetcherProps {
  children: React.ReactNode;
}

const CardDetailFetcher = ({ children }: CardDetailFetcherProps) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { id: cardId } = params;

  const { cardRefresh } = useSelector((state: RootState) => state.refresh);

  const deps = [cardRefresh];

  const cardDetail: any = fetchCardDetail(
    `/api/overwatch/boards/${cardId}`,
    deps,
  );

  useEffect(() => {
    dispatch(cardActions.SET_CURRENT_CARD(cardDetail));
  }, [cardDetail, dispatch]);

  return <div>{children}</div>;
};

export default CardDetailFetcher;
