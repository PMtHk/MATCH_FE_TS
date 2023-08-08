import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store';
import { cardActions } from 'store/card-slice';
import { fetchCardDetail } from 'apis/api/overwatch';
import { asyncGetIsReviewed, getIsReviewed } from 'apis/api/firebase';

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

  const cardDetail: any = fetchCardDetail(
    `/api/overwatch/boards/${cardId}`,
    deps,
  );

  useEffect(() => {
    dispatch(cardActions.SET_CURRENT_CARD(cardDetail));

    const getIsReviewed2 = async () => {
      const review = await asyncGetIsReviewed(oauth2Id, currentCard.chatRoomId);
      dispatch(cardActions.SET_IS_REVIEWED(review));
    };

    if (currentCard) {
      if (joinedChatRoomsId.includes(currentCard.chatRoomId)) {
        getIsReviewed2();
      }
    }
  }, [cardDetail, dispatch]);

  return <div>{children}</div>;
};

export default CardDetailFetcher;
