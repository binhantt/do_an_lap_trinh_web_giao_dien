import axios from 'axios';
import api from '../../config/api';
import { loginStart, loginSuccess, loginFailure, logout } from './authSlice';

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

export const loginUser = (credentials) => async (dispatch) => {
    try {
        dispatch(loginStart());
        
        const response = await axios.post('http://localhost:5284/api/v1/user/login', {
            email: credentials.email,
            password: credentials.password
        });
        
        if (response.data && response.data.success) {
            const userData = response.data.data.user;
            const token = response.data.data.token;
            
            if (userData && userData.id) {
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                dispatch(loginSuccess(userData));
                return { success: true, fullName: userData.fullName }; // Return fullName for navigation
            }
        }
        
        dispatch(loginFailure('Invalid response from server'));
        return { success: false };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        dispatch(loginFailure(errorMessage));
        return { success: false };
    }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('isUser');
  delete axios.defaults.headers.common['Authorization'];
  dispatch(logout());
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:5284/api/v1/user/register', {
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber
    });
    
    if (response.data) {
      const userData = response.data.user || response.data.data; // Ensure correct data extraction
      const token = response.data.token;
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        dispatch(loginSuccess(userData)); // Dispatch loginSuccess with user data
        return { success: true, data: response.data };
      }
    }
    return { success: false, error: 'Registration failed' };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed'
    };
  }
};
