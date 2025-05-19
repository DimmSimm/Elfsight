// features/charactersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_CHARACTERS_URL = 'https://rickandmortyapi.com/api/character/';

// Асинхронный thunk для загрузки данных персонажей по URL
export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async (url) => {
    const response = await axios.get(url);

    return response.data;
  }
);

const initialState = {
  filters: {
    status: '',
    gender: '',
    species: '',
    name: '',
    type: ''
  },
  apiURL: API_CHARACTERS_URL,
  characters: [],
  info: {}, // для пагинации (pages, count и т.п.)
  activePage: 0,
  loading: false,
  error: null
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = action.payload;
      state.activePage = 0; // сброс страницы при смене фильтров
      // Формируем URL с фильтрами и page=1
      const url = new URL(API_CHARACTERS_URL);
      Object.entries(action.payload).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
      url.searchParams.set('page', 0);
      state.apiURL = url.toString();
    },
    setActivePage(state, action) {
      state.activePage = action.payload;
      // Обновляем параметр page в URL
      const url = new URL(state.apiURL);
      url.searchParams.set('page', action.payload.toString());
      state.apiURL = url.toString();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        state.characters = action.payload.results;
        state.info = action.payload.info;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setFilters, setActivePage } = charactersSlice.actions;
export const charactersReducer = charactersSlice.reducer;
