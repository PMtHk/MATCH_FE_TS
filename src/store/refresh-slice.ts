import { createSlice } from '@reduxjs/toolkit';

interface IState {
  remainingTime: number;
  cardRefresh: number;
}

export const REFRESH_CYCLE = 60 * 5 * 1000;

const initialState: IState = {
  remainingTime: REFRESH_CYCLE,
  cardRefresh: 0,
};

const refreshSlice = createSlice({
  name: 'refresh-list',
  initialState,
  reducers: {
    INITIALIZE: (state) => {
      state.remainingTime = REFRESH_CYCLE;
    },
    DECREASE: (state) => {
      state.remainingTime -= 1;
    },
    FORCE_REFRESH: (state) => {
      state.remainingTime = 0;
    },
    REFRESH_CARD: (state) => {
      state.cardRefresh += 1;
    },
  },
});

export const refreshActions = refreshSlice.actions;

export default refreshSlice;
