import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cardActions } from 'store/card-slice';
import { fetchCardList } from 'apis/api/leagueoflegends';
import { RootState } from 'store';

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

  const { currentPage } = useSelector((state: RootState) => state.card);

  const config = {
    params: {
      size: 12,
      page: currentPage,
      position: lane,
      type: queueType,
      tier,
    },
  };

  const deps = [lane, queueType, tier, currentPage];

  const cardList: any = fetchCardList('/api/lol/boards', config, deps);

  useEffect(() => {
    dispatch(cardActions.SET_TOTAL_PAGE(cardList?.totalPage));
    dispatch(
      cardActions.SET_CARDS({ game: 'lol', cardList: cardList?.content }),
    );
    return () => {
      dispatch(cardActions.SET_CARDS([]));
    };
  }, [cardList, dispatch]);

  return <div>{children}</div>;
};

export default CardListFetcher;
