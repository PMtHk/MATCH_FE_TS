import { createSlice } from '@reduxjs/toolkit';

interface IState {
  cards: [];
  currentPageNum: number;
  currentCard: any;
}

const initialState: IState = {
  cards: [],
  currentPageNum: 0,
  currentCard: null,
};

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    SET_CARDS: (state, action) => {
      state.cards = action.payload;
    },
    SET_CURRENT_PAGENUM: (state, action) => {
      state.currentPageNum = action.payload;
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
