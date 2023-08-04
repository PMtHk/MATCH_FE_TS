import { createSlice } from '@reduxjs/toolkit';

interface IState {
  remainingTime: number;
}

export const REFRESH_CYCLE = 60;

const initialState: IState = {
  remainingTime: REFRESH_CYCLE,
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
  },
});

export const refreshActions = refreshSlice.actions;

export default refreshSlice;
