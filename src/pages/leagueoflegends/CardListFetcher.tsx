import React from 'react';
import { useDispatch } from 'react-redux';

import { cardActions } from 'store/card-slice';
import useGetData from 'useGetData';

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

  const cardList: any = useGetData('/api/lol/boards', config);
  dispatch(cardActions.SET_CARDS(cardList?.content));

  return <div>{children}</div>;
};

export default CardListFetcher;
