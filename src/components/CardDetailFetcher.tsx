import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { asyncGetIsReviewed } from 'apis/api/firebase';
import { fetchCardDetail } from 'apis/api/common';
import { RootState } from 'store';
import { cardActions } from 'store/card-slice';
import { isInParty } from 'functions/commons';
import { GAME_ID } from 'types/games';

interface CardDetailFetcherProps {
  children: React.ReactNode;
  game: GAME_ID;
}

const CardDetailFetcher = ({ children, game }: CardDetailFetcherProps) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { id: cardId } = params;

  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);
  const { cardRefresh } = useSelector((state: RootState) => state.refresh);

  const deps = [cardRefresh];

  const cardDetail: any = fetchCardDetail(
    `/api/${game}/boards/${cardId}`,
    deps,
  );

  useEffect(() => {
    dispatch(cardActions.SET_CURRENT_CARD(cardDetail));

    const getIsReviewed = async () => {
      const review = await asyncGetIsReviewed(oauth2Id, currentCard.chatRoomId);
      dispatch(cardActions.SET_IS_REVIEWED(review));
    };

    if (currentCard) {
      if (isInParty(currentCard.memberList, oauth2Id)) {
        getIsReviewed();
      }
    }
  }, [cardDetail, dispatch]);

  return <div>{children}</div>;
};

export default CardDetailFetcher;
