import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    fetchOrdersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    selectOrder(state, action) {
      state.selectedOrder = action.payload;
    },
    createOrderSuccess(state, action) {
      state.orders.push(action.payload);
    },
    updateOrderSuccess(state, action) {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    deleteOrderSuccess(state, action) {
      state.orders = state.orders.filter(order => order.id !== action.payload);
    }
  }
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  selectOrder,
  createOrderSuccess,
  updateOrderSuccess,
  deleteOrderSuccess
} = orderSlice.actions;

export default orderSlice.reducer;