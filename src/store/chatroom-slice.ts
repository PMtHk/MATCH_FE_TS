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
    SET_JOINED_CHATROOMS_ID: (state, action) => {
      state.joinedChatRoomsId = action.payload;
    },
    ADD_JOINED_CHATROOMS_ID: (state, action) => {
      state.joinedChatRoomsId = [...state.joinedChatRoomsId, action.payload];
    },
    LEAVE_JOINED_CHATROOMS_ID: (state, action) => {
      state.joinedChatRoomsId = state.joinedChatRoomsId.filter(
        (chatroomId) => chatroomId !== action.payload,
      );
    },
    REMOVE_ALL_JOINED_CHATROOMS_ID: (state) => {
      state.joinedChatRoomsId = [];
    },
  },
});

export const chatroomActions = chatroomSlice.actions;

export default chatroomSlice;
