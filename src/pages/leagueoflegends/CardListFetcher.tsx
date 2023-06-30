import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { cardActions } from 'store/card-slice';
import { fetchCardList } from 'useGetData';

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

  const config = {
    params: {
      size: 12,
      page: 0,
      position: lane,
      type: queueType,
      tier,
    },
  };

  const deps = [lane, queueType, tier];

  const cardList: any = fetchCardList('/api/lol/boards', config, deps);

  useEffect(() => {
    dispatch(cardActions.SET_CARDS(cardList?.content));
  }, [cardList, dispatch]);

  return <div>{children}</div>;
};

export default CardListFetcher;
