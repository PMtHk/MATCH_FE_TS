import { createSlice } from '@reduxjs/toolkit';

interface IState {
  lolCards: [];
  pubgCards: [];
  overwatchCards: [];
  valorantCards: [];
  followCards: [];
  currentPage: number;
  totalPage: number;
  followCurrentPage: number;
  followTotalPage: number;
  currentCard: any;
  isReviewed: boolean | undefined;
}

const initialState: IState = {
  lolCards: [],
  pubgCards: [],
  overwatchCards: [],
  valorantCards: [],
  followCards: [],
  currentPage: 0,
  totalPage: 0,
  followCurrentPage: 0,
  followTotalPage: 0,
  currentCard: null,
  isReviewed: true,
};

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    SET_CARDS: (state, action) => {
      const { game, cardList } = action.payload;
      switch (game) {
        case 'lol':
          state.lolCards = cardList;
          break;
        case 'pubg':
          state.pubgCards = cardList;
          break;
        case 'overwatch':
          state.overwatchCards = cardList;
          break;
        case 'valorant':
          state.valorantCards = cardList;
          break;
        default:
          break;
      }
    },
    SET_FOLLOW_CARDS: (state, action) => {
      state.followCards = action.payload;
    },
    SET_CURRENT_PAGE: (state, action) => {
      state.currentPage = action.payload;
    },
    SET_TOTAL_PAGE: (state, action) => {
      state.totalPage = action.payload;
    },
    SET_F_CURRENT_PAGE: (state, action) => {
      state.followCurrentPage = action.payload;
    },
    SET_F_TOTAL_PAGE: (state, action) => {
      state.followTotalPage = action.payload;
    },
    SET_CURRENT_CARD: (state, action) => {
      state.currentCard = action.payload;
    },
    DELETE_CURRENT_CARD: (state) => {
      state.currentCard = {};
    },
    SET_IS_REVIEWED: (state, action) => {
      state.isReviewed = action.payload;
    },
  },
});

export const cardActions = cardSlice.actions;

export default cardSlice;
