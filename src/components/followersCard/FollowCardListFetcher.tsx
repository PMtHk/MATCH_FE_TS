import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store';
import { cardActions } from 'store/card-slice';
import { GAME_ID } from 'types/games';
import { fetchFollowCardList } from 'apis/api/user';

interface CardListFetcherProps {
  game: GAME_ID;
  children: React.ReactNode;
  refresh: number;
}

const CardListFetcher = ({ children, game, refresh }: CardListFetcherProps) => {
  const dispatch = useDispatch();

  const { isLogin } = useSelector((state: RootState) => state.user);
  const { followCurrentPage } = useSelector((state: RootState) => state.card);

  const followConfing = {
    params: {
      size: 3,
      page: followCurrentPage || 0,
      game,
    },
  };

  const followDeps = [refresh, followCurrentPage];

  if (isLogin) {
    const followCardList: any = fetchFollowCardList(
      '/api/user/follower/boards',
      followConfing,
      followDeps,
    );

    useEffect(() => {
      dispatch(cardActions.SET_F_TOTAL_PAGE(followCardList?.totalPage));
      dispatch(cardActions.SET_FOLLOW_CARDS(followCardList?.content));
    }, [followCardList, dispatch]);
  }

  return <div>{children}</div>;
};

export default CardListFetcher;
