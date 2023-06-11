import { createSlice } from '@reduxjs/toolkit';

type representative = 'lol' | 'pubg';

interface IState {
  nickname: string;
  oauth2Id: string;
  profileImage: string;
  representative: representative | '';
  games: {
    lol: string;
    pubg: string;
  };
  isLogin: boolean;
}

interface ISet_User {
  payload: {
    nickname: string;
    oauth2Id: string;
    profileImage: string;
    representative: representative;
  };
}

interface ISet_Representative {
  payload: {
    representative: representative;
  };
}

interface ISet_Games {
  payload: {
    games: {
      lol: string;
      pubg: string;
    };
  };
}

interface ISet_Games_With_Id {
  payload: {
    id: 'lol' | 'pubg';
    value: string;
  };
}

const initialState: IState = {
  nickname: '', // 카카오톡 닉네임
  oauth2Id: '', // kakao oauth id
  profileImage: '', // 카카오톡 프로필 이미지
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
    DELETE_USER: (state, _action) => {
      state.nickname = '';
      state.oauth2Id = '';
      state.profileImage = '';
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
