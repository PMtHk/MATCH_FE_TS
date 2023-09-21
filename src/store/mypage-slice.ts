import { createSlice } from '@reduxjs/toolkit';

interface IState {
  id: number;
  oauth2Id: string;
  nickname: string;
  email: string;
  imageUrl: string;
  representative: string;
  lol: string;
  pubg: string;
  overwatch: string;
  likeCount: number;
  dislikeCount: number;
  matchCount: number;
  created: string;
  lolInfo: object | null;
  pubgInfo: object | null;
  overwatchInfo: object | null;
  valorantInfo: object | null;
  refreshLolInfo: boolean;
  refreshPubgInfo: boolean;
  refreshOverwatchInfo: boolean;
  refreshValorantInfo: boolean;
}

const initialState: IState = {
  id: 0,
  oauth2Id: '',
  nickname: '',
  email: '',
  imageUrl: '',
  representative: '',
  lol: '',
  pubg: '',
  overwatch: '',
  likeCount: 0,
  dislikeCount: 0,
  matchCount: 0,
  created: '',
  lolInfo: null,
  pubgInfo: null,
  overwatchInfo: null,
  valorantInfo: null,
  refreshLolInfo: false,
  refreshPubgInfo: false,
  refreshOverwatchInfo: false,
  refreshValorantInfo: false,
};

const mypageSlice = createSlice({
  name: 'mypage',
  initialState,
  reducers: {
    SET_MYPAGE: (state, action) => {
      state.id = action.payload.id;
      state.oauth2Id = action.payload.oauth2Id;
      state.nickname = action.payload.nickname;
      state.email = action.payload.email;
      state.imageUrl = action.payload.imageUrl;
      state.representative = action.payload.representative;
      state.lol = action.payload.lol;
      state.pubg = action.payload.pubg;
      state.overwatch = action.payload.overwatch;
      state.likeCount = action.payload.likeCount;
      state.dislikeCount = action.payload.dislikeCount;
      state.matchCount = action.payload.matchCount;
      state.created = action.payload.created;
    },
    RESET_MYPAGE: (state) => {
      state.id = 0;
      state.oauth2Id = '';
      state.nickname = '';
      state.email = '';
      state.imageUrl = '';
      state.representative = '';
      state.lol = '';
      state.pubg = '';
      state.overwatch = '';
      state.likeCount = 0;
      state.dislikeCount = 0;
      state.matchCount = 0;
      state.created = '';
      state.lolInfo = null;
      state.pubgInfo = null;
      state.overwatchInfo = null;
      state.valorantInfo = null;
    },
    SET_LOLINFO: (state, action) => {
      state.lolInfo = action.payload;
    },
    SET_PUBGINFO: (state, action) => {
      state.pubgInfo = action.payload;
    },
    SET_OVERWATCHINFO: (state, action) => {
      state.overwatchInfo = action.payload;
    },
    TOGGLE_REFRESH_LOL: (state) => {
      state.refreshLolInfo = !state.refreshLolInfo;
    },
    TOGGLE_REFRESH_PUBG: (state) => {
      state.refreshPubgInfo = !state.refreshPubgInfo;
    },
    TOGGLE_REFRESH_OVERWATCH: (state) => {
      state.refreshOverwatchInfo = !state.refreshOverwatchInfo;
    },
    TOGGLE_REFRESH_VALORANT: (state) => {
      state.refreshValorantInfo = !state.refreshValorantInfo;
    },
  },
});

export const mypageActions = mypageSlice.actions;

export default mypageSlice;
