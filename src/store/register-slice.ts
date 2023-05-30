import { createSlice } from '@reduxjs/toolkit';

type representative = '' | 'lol' | 'pubg';

type state = {
  representative: representative;
  games: {
    lol: string;
    pubg: string;
  };
};

type SET_REPRESENTATIVE_ACTION = {
  payload: {
    representative: representative;
  };
};

type SET_GAMES_WITH_ID_ACTION = {
  payload: {
    id: 'lol' | 'pubg';
    value: string;
  };
};

const initialState: state = {
  representative: '',
  games: {
    lol: '',
    pubg: '',
  },
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    SET_REPRESENTATIVE: (state, action: SET_REPRESENTATIVE_ACTION) => {
      state.representative = action.payload.representative;
    },
    SET_GAMES_WITH_ID: (state, action: SET_GAMES_WITH_ID_ACTION) => {
      state.games[action.payload.id] = action.payload.value;
    },
    DELETE_REGISTER: (state, _action) => {
      state.representative = '';
      state.games = {
        lol: '',
        pubg: '',
      };
    },
  },
});

export const registerActions = registerSlice.actions;

export default registerSlice;
