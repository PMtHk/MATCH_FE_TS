import { createSlice } from '@reduxjs/toolkit';

type state = {
  accessToken: string;
};

type SET_TOKEN_ACTION = {
  payload: {
    accessToken: string;
  };
};

const initialState: state = {
  accessToken: '',
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    SET_TOKEN: (state, action: SET_TOKEN_ACTION) => {
      state.accessToken = action.payload.accessToken;
    },
    DELETE_TOKEN: (state, _action) => {
      state.accessToken = '';
    },
  },
});

export const tokenActions = tokenSlice.actions;

export default tokenSlice;
