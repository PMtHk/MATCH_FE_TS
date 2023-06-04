import { createSlice } from '@reduxjs/toolkit';

interface IState {
  accessToken: string;
}

interface ISet_Token {
  payload: {
    accessToken: string;
  };
}

const initialState: IState = {
  accessToken: '',
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    SET_TOKEN: (state, action: ISet_Token) => {
      state.accessToken = action.payload.accessToken;
    },
    DELETE_TOKEN: (state, _action) => {
      state.accessToken = '';
    },
  },
});

export const tokenActions = tokenSlice.actions;

export default tokenSlice;
