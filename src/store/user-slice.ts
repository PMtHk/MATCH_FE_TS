import { createSlice } from '@reduxjs/toolkit';

type representative = '' | 'lol' | 'pubg';

type state = {
  nickname: string;
  oauth2Id: string;
  profile_imageUrl: string;
  representative: representative;
  games: {
    lol: string;
    pubg: string;
  };
  isLogin: boolean;
};

type SET_USER_ACTION = {
  payload: {
    nickname: string;
    oauth2Id: string;
    profile_imageUrl: string;
    representative: representative;
  };
};

type SET_REPRESENTATIVE_ACTION = {
  payload: {
    representative: representative;
  };
};

type SET_GAMES_ACTION = {
  payload: {
    games: {
      lol: string;
      pubg: string;
    };
  };
};

type SET_GAMES_WITH_ID_ACTION = {
  payload: {
    id: 'lol' | 'pubg';
    value: string;
  };
};

const initialState: state = {
  nickname: '', // 카카오톡 닉네임
  oauth2Id: '', // kakao oauth id
  profile_imageUrl: '', // 카카오톡 프로필 이미지
  representative: '', // 대표게임
  games: {
    lol: '', // 롤 소환사명
    pubg: '', // 배틀그라운드 유저네임
  },
  isLogin: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_USER: (state, action: SET_USER_ACTION) => {
      state.nickname = action.payload.nickname;
      state.oauth2Id = action.payload.oauth2Id;
      state.profile_imageUrl = action.payload.profile_imageUrl;
      state.representative = action.payload.representative;
      state.isLogin = true;
    },
    SET_REPRESENTATIVE: (state, action: SET_REPRESENTATIVE_ACTION) => {
      state.representative = action.payload.representative;
    },
    SET_GAMES: (state, action: SET_GAMES_ACTION) => {
      state.games = action.payload.games;
    },
    SET_GAMES_WITH_ID: (state, action: SET_GAMES_WITH_ID_ACTION) => {
      state.games[action.payload.id] = action.payload.value;
    },
    DELETE_USER: (state, _action) => {
      state.nickname = '';
      state.oauth2Id = '';
      state.profile_imageUrl = '';
      state.representative = '';
      state.games = {
        lol: '',
        pubg: '',
      };
      state.isLogin = false;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
