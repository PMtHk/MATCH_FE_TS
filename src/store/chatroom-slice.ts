import { createSlice } from '@reduxjs/toolkit';

interface IState {
  joinedChatRoomsId: string[];
}

const initialChatroomState: IState = {
  joinedChatRoomsId: [],
};

const chatroomSlice = createSlice({
  name: 'chatroom',
  initialState: initialChatroomState,
  reducers: {
    ADD_JOINED_CHATROOMS_ID: (state, action) => {
      state.joinedChatRoomsId = [...state.joinedChatRoomsId, action.payload];
    },
    LEAVE_JOINED_CHATROOMS_ID: (state, action) => {
      state.joinedChatRoomsId = state.joinedChatRoomsId.filter(
        (chatroomId) => chatroomId !== action.payload,
      );
    },
    REMOVE_ALL_JOINED_CHATROOMS_ID: (state, _) => {
      state.joinedChatRoomsId = [];
    },
  },
});

export const chatroomActions = chatroomSlice.actions;

export default chatroomSlice;
