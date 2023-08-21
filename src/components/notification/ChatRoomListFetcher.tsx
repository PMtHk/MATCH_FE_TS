import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUserChatRooms } from 'apis/api/user';
import { chatroomActions } from 'store/chatroom-slice';
import { messageActions } from 'store/message-slice';

import {
  getAChatRoomInfo,
  getALastRead,
  getFirstRead,
} from 'apis/api/firebase';

import { RootState } from 'store';
import { GAME_ID } from 'types/games';
import { notificationActions } from 'store/notification-slice';

interface ChatRoomListFetcherProps {
  children: React.ReactNode;
}

const ChatRoomListFetcher = ({ children }: ChatRoomListFetcherProps) => {
  const dispatch = useDispatch();

  const { oauth2Id } = useSelector((state: RootState) => state.user);

  const chatRoomList: any = getUserChatRooms();

  React.useEffect(() => {
    dispatch(messageActions.REMOVE_MESSAGES());
    dispatch(chatroomActions.REMOVE_ALL_JOINED_CHATROOMS_ID());

    if (chatRoomList && chatRoomList.length > 0) {
      chatRoomList.map(async (aChatRoomId: string) => {
        const dataSnapshot: any = await getAChatRoomInfo(aChatRoomId);

        const firstRead = await getFirstRead(oauth2Id, aChatRoomId);

        if (
          dataSnapshot &&
          dataSnapshot.game &&
          dataSnapshot.isDeleted === false &&
          dataSnapshot.isFinished === false
        ) {
          dispatch(
            chatroomActions.ADD_JOINED_CHATROOMS_ID({
              chatRoomId: aChatRoomId,
              game: dataSnapshot.game as GAME_ID,
              id: dataSnapshot.roomId,
              firstRead: firstRead || 9999999999999,
            }),
          );
          const lastRead: any = await getALastRead(oauth2Id, aChatRoomId);
          dispatch(
            notificationActions.SET_TIMESTAMPS({
              chatRoomId: aChatRoomId,
              timestamp: lastRead,
            }),
          );
        }
      });
    }
  }, [chatRoomList, dispatch]);

  return <div>{children}</div>;
};

export default ChatRoomListFetcher;
