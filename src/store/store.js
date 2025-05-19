import { configureStore } from '@reduxjs/toolkit';
import { paginationReducer } from '../slices/paginationSlice';
import { charactersReducer } from '../slices/charactersSlice';

export const store = configureStore({
  reducer: {
    pagination: paginationReducer,
    characters: charactersReducer
  }
});
