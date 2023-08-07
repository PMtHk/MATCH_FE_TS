import { createSlice } from '@reduxjs/toolkit';

interface IState {
  notiToken: string;
  badgeNum: number;
  timestamps: { [key: string]: number };
  detachedLastRead: string[];
}

const initialState: IState = {
  notiToken: '',
  badgeNum: 0,
  timestamps: {},
  detachedLastRead: [],
};

interface I_ADD_DETACHEDLASTREAD {
  payload: string;
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // 토큰 저장
    SET_NOTITOKEN: (state, action) => {
      state.notiToken = action.payload;
    },
    // 토큰 삭제
    DELETE_NOTITOKEN: (state) => {
      state.notiToken = '';
    },
    SET_BADGE_NUM: (state, action) => {
      state.badgeNum = action.payload;
    },
    // 각 채팅방 별 마지막 활동 timestamp
    SET_TIMESTAMPS: (state, action) => {
      const { chatRoomId, timestamp } = action.payload;
      state.timestamps[chatRoomId] = timestamp;
    },
    DELETE_NOTIFICATION: (state) => {
      state.notiToken = '';
      state.badgeNum = 0;
      state.timestamps = {};
    },
    ADD_DETACHED_LASTREAD: (state, action: I_ADD_DETACHEDLASTREAD) => {
      state.detachedLastRead.push(action.payload);
    },
  },
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice;
