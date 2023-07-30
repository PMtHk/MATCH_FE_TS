import { createSlice } from '@reduxjs/toolkit';

interface IState {
  lolCards: [];
  pubgCards: [];
  overwatchCards: [];
  valorantCards: [];
  currentPage: number;
  totalPage: number;
  currentCard: any;
  isReviewed: boolean | undefined;
}

const initialState: IState = {
  lolCards: [],
  pubgCards: [],
  overwatchCards: [],
  valorantCards: [],
  currentPage: 0,
  totalPage: 0,
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
    SET_CURRENT_PAGE: (state, action) => {
      state.currentPage = action.payload;
    },
    SET_TOTAL_PAGE: (state, action) => {
      state.totalPage = action.payload;
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
