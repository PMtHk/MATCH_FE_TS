import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { asyncGetIsReviewed } from 'apis/api/firebase';
import { fetchCardDetail } from 'apis/api/common';
import { RootState } from 'store';
import { cardActions } from 'store/card-slice';
import { getIsJoined } from 'functions/commons';

interface CardDetailFetcherProps {
  children: React.ReactNode;
}

const CardDetailFetcher = ({ children }: CardDetailFetcherProps) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { id: cardId } = params;

  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);
  const { joinedChatRoomsId } = useSelector(
    (state: RootState) => state.chatroom,
  );
  const { cardRefresh } = useSelector((state: RootState) => state.refresh);

  const deps = [cardRefresh];

  const cardDetail: any = fetchCardDetail(`/api/lol/boards/${cardId}`, deps);

  useEffect(() => {
    dispatch(cardActions.SET_CURRENT_CARD(cardDetail));

    const getIsReviewed = async () => {
      const review = await asyncGetIsReviewed(oauth2Id, currentCard.chatRoomId);
      dispatch(cardActions.SET_IS_REVIEWED(review));
    };

    if (currentCard) {
      if (getIsJoined(currentCard.chatRoomId, joinedChatRoomsId)) {
        getIsReviewed();
      }
    }
  }, [cardDetail, dispatch]);

  return <div>{children}</div>;
};

export default CardDetailFetcher;
