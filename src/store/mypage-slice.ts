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
  },
});

export const mypageActions = mypageSlice.actions;

export default mypageSlice;
