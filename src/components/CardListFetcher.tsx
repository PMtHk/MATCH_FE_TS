import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store';
import { cardActions } from 'store/card-slice';
import { refreshActions } from 'store/refresh-slice';
import { fetchCardList } from 'apis/api/common';
import { useInterval } from 'hooks/useInterval';
import { GAME_ID } from 'types/games';

interface CardListFetcherProps {
  game: GAME_ID;
  params: {
    position?: string;
    platform?: string;
    type: string;
    tier: string;
  };
  gameDeps: any[];
  children: React.ReactNode;
}

const CardListFetcher = ({
  children,
  params,
  game,
  gameDeps,
}: CardListFetcherProps) => {
  const dispatch = useDispatch();
  const { currentPage, followCurrentPage } = useSelector(
    (state: RootState) => state.card,
  );
  const { remainingTime } = useSelector((state: RootState) => state.refresh);

  const [refresh, setRefresh] = React.useState<number>(0);

  useInterval(() => {
    if (remainingTime === 0) {
      setRefresh((prev) => prev + 1);
      dispatch(refreshActions.INITIALIZE());
    } else {
      dispatch(refreshActions.DECREASE());
    }
  }, 1000);

  const config = {
    params: {
      size: 12,
      page: currentPage || 0,
      ...params,
    },
  };

  const deps = [...gameDeps, currentPage, refresh];

  const cardList: any = fetchCardList(`/api/${game}/boards`, config, deps);

  useEffect(() => {
    dispatch(cardActions.SET_TOTAL_PAGE(cardList?.totalPage));
    dispatch(cardActions.SET_CARDS({ game, cardList: cardList?.content }));
  }, [cardList, dispatch]);

  return <div>{children}</div>;
};

export default CardListFetcher;
