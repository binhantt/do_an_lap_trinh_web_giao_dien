import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import categoryReducer from './category/categorySlice';
import  usersReducer  from './user/userSlice';
import PruductReducer from './product/productSlice';
// Import other reducers as needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    users: usersReducer,
    product : PruductReducer, 
  },
});

export default store;