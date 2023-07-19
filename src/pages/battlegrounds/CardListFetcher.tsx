import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { cardActions } from 'store/card-slice';
import { fetchCardList } from 'apis/api/battlegrounds';

interface CardListFetcherProps {
  fetcherProps: {
    platform: string;
    type: string;
    tier: string;
  };
  children: React.ReactNode;
}

const CardListFetcher = ({
  children,
  fetcherProps: { platform, type, tier },
}: CardListFetcherProps) => {
  const dispatch = useDispatch();

  const config = {
    params: {
      size: 12,
      page: 0,
      platform,
      type,
      tier,
    },
  };

  const deps = [platform, type, tier];

  const cardList: any = fetchCardList('/api/pubg/boards', config, deps);

  useEffect(() => {
    dispatch(cardActions.SET_CARDS(cardList?.content));
  }, [cardList, dispatch]);

  return <div>{children}</div>;
};

export default CardListFetcher;
