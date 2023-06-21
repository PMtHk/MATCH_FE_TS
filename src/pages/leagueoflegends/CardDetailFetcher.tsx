import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useErrorBoundary } from 'react-error-boundary';

import { defaultAxios } from 'apis/utils';
import { cardActions } from 'store/card-slice';

interface CardDetailFetcherProps {
  children: React.ReactNode;
}

const CardDetailFetcher = ({ children }: CardDetailFetcherProps) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { showBoundary, resetBoundary } = useErrorBoundary();
  const currentGame = location.pathname.split('/')[1].toLowerCase();

  const params = useParams();
  const { id: cardId } = params;

  React.useEffect(() => {
    const fetchCardDetail = async () => {
      resetBoundary();

      await defaultAxios
        .get(`/api/${currentGame}/boards/${cardId}`)
        .then((response) => {
          dispatch(cardActions.SET_CURRENT_CARD(response.data));
        })
        .catch((error) => {
          showBoundary(error);
        });
    };

    fetchCardDetail();
  }, []);

  return <div>{children}</div>;
};

export default CardDetailFetcher;
