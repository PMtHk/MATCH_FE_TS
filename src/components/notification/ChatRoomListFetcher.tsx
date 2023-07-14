import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUserChatRooms } from 'apis/api/user';
import { chatroomActions } from 'store/chatroom-slice';

import { getAllLastReads } from 'apis/api/firebase';

import { RootState } from 'store';

interface ChatRoomListFetcherProps {
  children: React.ReactNode;
}

const ChatRoomListFetcher = ({ children }: ChatRoomListFetcherProps) => {
  const dispatch = useDispatch();

  const { oauth2Id } = useSelector((state: RootState) => state.user);

  const chatRoomList = getUserChatRooms();

  React.useEffect(() => {
    dispatch(chatroomActions.SET_JOINED_CHATROOMS_ID(chatRoomList));
    if (Array.isArray(chatRoomList) && typeof chatRoomList[0] === 'string') {
      getAllLastReads(oauth2Id, chatRoomList, dispatch);
    }
  }, [chatRoomList, dispatch]);

  return <div>{children}</div>;
};

export default ChatRoomListFetcher;
