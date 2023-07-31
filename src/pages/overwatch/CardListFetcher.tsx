import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cardActions } from 'store/card-slice';
import { fetchCardList } from 'apis/api/overwatch';
import { RootState } from 'store';

interface CardListFetcherProps {
  fetcherProps: {
    position: string;
    queueType: string;
    tier: string;
  };
  children: React.ReactNode;
}

const CardListFetcher = ({
  children,
  fetcherProps: { position, queueType, tier },
}: CardListFetcherProps) => {
  const dispatch = useDispatch();

  const { currentPage } = useSelector((state: RootState) => state.card);

  const config = {
    params: {
      size: 12,
      page: currentPage || 0,
      position,
      type: queueType,
      tier,
    },
  };

  const deps = [position, queueType, tier, currentPage];

  const cardList: any = fetchCardList('/api/overwatch/boards', config, deps);

  useEffect(() => {
    dispatch(cardActions.SET_TOTAL_PAGE(cardList?.totalPage));
    dispatch(
      cardActions.SET_CARDS({ game: 'overwatch', cardList: cardList?.content }),
    );
  }, [cardList, dispatch]);

  return <div>{children}</div>;
};

export default CardListFetcher;
