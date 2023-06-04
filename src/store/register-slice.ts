import { createSlice } from '@reduxjs/toolkit';

export type representative = 'lol' | 'pubg';

interface IState {
  representative: representative | '';
  games: {
    lol: string;
    pubg: string;
  };
}

interface ISet_Representative {
  payload: {
    representative: representative;
  };
}

interface ISet_Games_With_Id {
  payload: {
    id: representative;
    value: string;
  };
}

const initialState: IState = {
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
    SET_REPRESENTATIVE: (state, action: ISet_Representative) => {
      state.representative = action.payload.representative;
    },
    SET_GAMES_WITH_ID: (state, action: ISet_Games_With_Id) => {
      state.games[action.payload.id] = action.payload.value;
    },
    DELETE_REGISTER: (state, _) => {
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
