import React from 'react';
import { defaultAxios } from 'apis/utils';
import { useDispatch } from 'react-redux';
import { useErrorBoundary } from 'react-error-boundary';

import { cardActions } from 'store/card-slice';

interface CardListFetcherProps {
  fetcherProps: {
    lane: string;
    queueType: string;
    tier: string;
  };
  children: React.ReactNode;
}

const CardListFetcher = ({
  children,
  fetcherProps: { lane, queueType, tier },
}: CardListFetcherProps) => {
  const dispatch = useDispatch();
  const { showBoundary, resetBoundary } = useErrorBoundary();

  React.useEffect(() => {
    const fetchCards = async () => {
      resetBoundary();

      await defaultAxios
        .get('/api/lol/boards', {
          params: { size: 12, page: 0, position: lane, type: queueType, tier },
        })
        .then((response) => {
          dispatch(cardActions.SET_CARDS(response.data.content));
        })
        .catch((error) => {
          showBoundary(error);
        });
    };

    fetchCards();
  }, [lane, queueType, tier, resetBoundary]);

  return <div>{children}</div>;
};

export default CardListFetcher;
