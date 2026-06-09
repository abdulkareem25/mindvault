import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  activeFilters: { category: 'all', type: 'all', isArchived: false },
  newMemoryIds: []  // IDs of newly extracted memories, for "new" dot indicator
};

export const vaultSlice = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    addNewMemoryIds: (state, action) => {
      state.newMemoryIds = [...state.newMemoryIds, ...action.payload];
    },
    clearNewMemoryIds: (state) => {
      state.newMemoryIds = [];
    }
  }
});

export const { setSearchQuery, setFilters, addNewMemoryIds, clearNewMemoryIds } = vaultSlice.actions;
export default vaultSlice.reducer;
