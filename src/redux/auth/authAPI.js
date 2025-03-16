import axios from 'axios';
import api from '../../config/api';
import { loginStart, loginSuccess, loginFailure, logout } from './authSlice';

// Keep the existing functions
export const loginAdmin = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    // Make API call using axios
    const response = await axios.post(`${api.api}/api/v1/admin/login`, {
      email: credentials.email,
      password: credentials.password
    });
    
    console.log('API Response:', response.data); // Log the API response

    // Check if login was successful
    if (response.data) {
      const userData = response.data.user || response.data.admin || response.data.data;
      const token = response.data.token || response.data.accessToken;
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (token) {
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        dispatch(loginSuccess(userData));
        return true;
      }
    }
    
    dispatch(loginFailure('Invalid response from server'));
    return false;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Login failed. Please try again.';
    
    dispatch(loginFailure(errorMessage));
    return false;
  }
};

export const checkAuthState = () => (dispatch) => {
  dispatch(loginStart());
  
  // Check if token exists in localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (token && user) {
    // Set authorization header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Update Redux state
    dispatch(loginSuccess(user));
    return true;
  } else {
    dispatch(loginFailure(null));
    return false;
  }
};

export const logoutAdmin = () => (dispatch) => {
  // Remove auth data from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('isAdmin');
  
  // Remove auth header
  delete axios.defaults.headers.common['Authorization'];
  
  dispatch(logout());
};
