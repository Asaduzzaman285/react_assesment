import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loadFromStorage } from '@/utils/localStorage';

interface ProductsState {
  searchQuery: string;
  selectedCategory: string;
  currentPage: number;
  pageSize: number;
}

const initialState: ProductsState = {
  searchQuery: '',
  selectedCategory: '',
  currentPage: 1,
  pageSize: loadFromStorage('pageSize', 10),
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.currentPage = 1;
    },
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setCurrentPage,
  setPageSize,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
