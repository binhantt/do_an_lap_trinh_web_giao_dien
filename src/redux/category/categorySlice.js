import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  loading: false,
  error: null
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    fetchCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createCategorySuccess: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategorySuccess: (state, action) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategorySuccess: (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
    }
  }
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  createCategorySuccess,
  updateCategorySuccess,
  deleteCategorySuccess
} = categorySlice.actions;

export default categorySlice.reducer;