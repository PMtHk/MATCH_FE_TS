import { createSlice } from '@reduxjs/toolkit';

interface IState {
  messages: { [key: string]: string[] };
}

const initialMessagesState: IState = {
  messages: {},
};

const messageSlice = createSlice({
  name: 'message',
  initialState: initialMessagesState,
  reducers: {
    SET_MESSAGES: (state, action) => {
      const { chatRoomId, message } = action.payload;
      // 각 채팅방의 메세지 저장
      if (state.messages[chatRoomId]) {
        state.messages[chatRoomId] = [...state.messages[chatRoomId], message];
      } else {
        state.messages[chatRoomId] = [message];
      }
    },
  },
});

export const messageActions = messageSlice.actions;

export default messageSlice;
