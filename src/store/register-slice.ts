import { createSlice } from '@reduxjs/toolkit';
import { GAME_ID } from 'types/games';

interface IState {
  kakaoCode: string;
  representative: GAME_ID | '';
  games: {
    lol: string;
    pubg: string;
    overwatch: string;
    valorant: string;
  };
}

interface ISet_Representative {
  payload: {
    representative: GAME_ID;
  };
}

interface ISet_Games_With_Id {
  payload: {
    id: GAME_ID;
    value: string;
  };
}

const initialState: IState = {
  kakaoCode: '',
  representative: '',
  games: {
    lol: '',
    pubg: '',
    overwatch: '',
    valorant: '',
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
    DELETE_REGISTER: (state) => {
      state.kakaoCode = '';
      state.representative = '';
      state.games = {
        lol: '',
        pubg: '',
        overwatch: '',
        valorant: '',
      };
    },
    SET_KAKAO_CODE: (state, action) => {
      state.kakaoCode = action.payload;
    },
  },
});

export const registerActions = registerSlice.actions;

export default registerSlice;
