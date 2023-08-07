import { createSlice } from '@reduxjs/toolkit';

import { CHATROOM } from 'types/chats';

interface IState {
  joinedChatRoomsId: CHATROOM[];
  detachedListener: string[];
}

const initialChatroomState: IState = {
  joinedChatRoomsId: [],
  detachedListener: [],
};

interface I_ADD_JOINED_CHATROOMS_ID {
  payload: CHATROOM;
}

interface I_LEAVE_JOINED_CHATROOMS_ID {
  payload: string;
}

interface I_ADD_DETACHEDLISTENER {
  payload: string;
}

const chatroomSlice = createSlice({
  name: 'chatroom',
  initialState: initialChatroomState,
  reducers: {
    ADD_JOINED_CHATROOMS_ID: (state, action: I_ADD_JOINED_CHATROOMS_ID) => {
      state.joinedChatRoomsId.unshift(action.payload);
    },
    LEAVE_JOINED_CHATROOMS_ID: (state, action: I_LEAVE_JOINED_CHATROOMS_ID) => {
      state.joinedChatRoomsId = state.joinedChatRoomsId.filter(
        (chatroom: CHATROOM) => chatroom.chatRoomId !== action.payload,
      );
    },
    REMOVE_ALL_JOINED_CHATROOMS_ID: (state) => {
      state.joinedChatRoomsId = [];
    },
    ADD_DETACHEDLISTENER: (state, action: I_ADD_DETACHEDLISTENER) => {
      state.detachedListener.push(action.payload);
    },
  },
});

export const chatroomActions = chatroomSlice.actions;

export default chatroomSlice;
