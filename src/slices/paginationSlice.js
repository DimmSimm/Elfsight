import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activePage: 1,
  apiURL: '',
  pages: []
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setActivePage(state, action) {
      state.activePage = action.payload;
    },
    setApiURL(state, action) {
      state.apiURL = action.payload;
    },
    setPages(state, action) {
      state.pages = action.payload;
    }
  }
});

export const { setActivePage, setApiURL, setPages } = paginationSlice.actions;

export const paginationReducer = paginationSlice.reducer;
