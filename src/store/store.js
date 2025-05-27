import { configureStore } from '@reduxjs/toolkit';
import { charactersReducer } from '../slices/charactersSlice';

export const store = configureStore({
  reducer: {
    characters: charactersReducer
  }
});
