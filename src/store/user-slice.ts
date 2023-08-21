import { createSlice } from '@reduxjs/toolkit';
import { GAME_ID } from 'types/games';

interface IState {
  nickname: string;
  oauth2Id: string;
  profileImage: string;
  representative: GAME_ID;
  games: {
    lol: string;
    pubg: string;
    overwatch: string;
    valorant: string;
  };
  isLogin: boolean;
  isAdmin: boolean;
}

interface ISet_User {
  payload: {
    nickname: string;
    oauth2Id: string;
    profileImage: string;
    representative: GAME_ID;
  };
}

interface ISet_Representative {
  payload: {
    representative: GAME_ID;
  };
}

interface ISet_Games {
  payload: {
    games: {
      lol: string;
      pubg: string;
      overwatch: string;
      valorant: string;
    };
  };
}

interface ISet_Games_With_Id {
  payload: {
    id: GAME_ID;
    value: string;
  };
}

const initialState: IState = {
  nickname: '', // 카카오톡 닉네임
  oauth2Id: '', // kakao oauth id
  profileImage: '', // 카카오톡 프로필 이미지
  representative: 'lol', // 대표게임
  games: {
    lol: '', // 롤 소환사명
    pubg: '', // 배틀그라운드 유저네임
    overwatch: '', // 오버워치 닉네임 + 배틀태그?
    valorant: '', // 발로란트 닉네임
  },
  isLogin: false,
  isAdmin: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_USER: (state, action: ISet_User) => {
      state.nickname = action.payload.nickname;
      state.oauth2Id = action.payload.oauth2Id;
      state.profileImage = action.payload.profileImage;
      state.representative = action.payload.representative;
      state.isLogin = true;
    },
    SET_REPRESENTATIVE: (state, action: ISet_Representative) => {
      state.representative = action.payload.representative;
    },
    SET_GAMES: (state, action: ISet_Games) => {
      state.games = action.payload.games;
    },
    SET_GAMES_WITH_ID: (state, action: ISet_Games_With_Id) => {
      state.games[action.payload.id] = action.payload.value;
    },
    DELETE_USER: (state) => {
      state.nickname = '';
      state.oauth2Id = '';
      state.profileImage = '';
      state.representative = 'lol';
      state.games = {
        lol: '',
        pubg: '',
        overwatch: '',
        valorant: '',
      };
      state.isLogin = false;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
