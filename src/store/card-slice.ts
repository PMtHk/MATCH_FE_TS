import { createSlice } from '@reduxjs/toolkit';

interface IState {
  cards: [];
  currentPage: number;
  totalPage: number;
  currentCard: any;
}

const initialState: IState = {
  cards: [],
  currentPage: 0,
  totalPage: 0,
  currentCard: null,
};

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    SET_CARDS: (state, action) => {
      state.cards = action.payload;
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
  },
});

export const cardActions = cardSlice.actions;

export default cardSlice;
