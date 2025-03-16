import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action) {
      state.loading = false;
      state.products = action.payload;
    },
    fetchProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    selectProduct(state, action) {
      state.selectedProduct = action.payload;
    },
    createProductSuccess(state, action) {
      state.products.push(action.payload);
    },
    updateProductSuccess(state, action) {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProductSuccess(state, action) {
      state.products = state.products.filter(product => product.id !== action.payload);
    }
  }
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  selectProduct,
  createProductSuccess,
  updateProductSuccess,
  deleteProductSuccess
} = productSlice.actions;

export default productSlice.reducer;