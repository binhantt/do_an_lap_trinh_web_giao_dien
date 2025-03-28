import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import categoryReducer from './category/categorySlice';
import usersReducer from './user/userSlice';
import productReducer from './product/productSlice';
import orderReducer from './order/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    users: usersReducer,
    product: productReducer,
    order: orderReducer,
  },
});

export default store;