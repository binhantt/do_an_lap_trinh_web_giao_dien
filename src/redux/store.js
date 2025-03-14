import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import categoryReducer from './category/categorySlice';
// Import other reducers as needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    // Add other reducers here
  },
});

export default store;