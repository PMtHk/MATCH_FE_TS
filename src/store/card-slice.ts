import { createSlice } from '@reduxjs/toolkit';

interface IState {
  cards: [];
  currentPage: number;
}

const initialState: IState = {
  cards: [],
  currentPage: 0,
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
  },
});

export const cardActions = cardSlice.actions;

export default cardSlice;
