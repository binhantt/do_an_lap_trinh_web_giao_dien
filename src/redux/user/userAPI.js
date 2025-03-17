import axios from 'axios';
import api from '../../config/api';
import { 
  fetchUsersStart, 
  fetchUsersSuccess, 
  fetchUsersFailure,
  fetchUserByIdSuccess,
  createUserSuccess,
  updateUserSuccess,
  deleteUserSuccess
} from './userSlice';

// Fetch all users
export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch(fetchUsersStart());
    const response = await axios.get(`${api.api}/api/v1/admin/users`);
    
    console.log('Fetch users response:', response.data);
    
    if (response.data && response.data.data && response.data.data.users && response.data.data.users.$values) {
      const users = response.data.data.users.$values || [];
      dispatch(fetchUsersSuccess(users));
      return users;
    } else {
      dispatch(fetchUsersFailure('Failed to fetch users'));
      return [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    dispatch(fetchUsersFailure(error.message || 'Failed to fetch users'));
    return [];
  }
};

// Fetch a single user by ID
export const fetchUserById = (id) => async (dispatch) => {
  try {
    dispatch(fetchUsersStart());
    const response = await axios.get(`${api.api}/api/admin/v1/user/${id}`);
    
    console.log('Fetch user by ID response:', response.data);
    
    if (response.data && response.data.success) {
      const user = response.data.data?.user || response.data.user;
      dispatch(fetchUserByIdSuccess(user));
      return {
        success: true,
        user: user
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to fetch user'
      };
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch user details';
    
    dispatch(fetchUsersFailure(errorMessage));
    return {
      success: false,
      message: errorMessage
    };
  }
};

// Create a new user
export const createUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post(`${api.api}/api/admin/v1/user`, userData);
    
    console.log('Create user response:', response.data);
    
    if (response.data && response.data.success) {
      const newUser = response.data.data?.user || response.data.user;
      dispatch(createUserSuccess(newUser));
      return {
        success: true,
        user: newUser
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to create user'
      };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to create user';
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

// Update a user by ID
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    console.log('Updating user with ID:', id, 'Data:', userData);
    
    const response = await axios.put(`${api.api}/api/v1/admin/manage-user/${id}`, userData);
    
    console.log('Update user response:', response.data);
    
    if (response.data && response.data.success) {
      const updatedUser = response.data.data?.user || response.data.user;
      dispatch(updateUserSuccess(updatedUser));
      return {
        success: true,
        user: updatedUser,
        message: 'User updated successfully'
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to update user'
      };
    }
  } catch (error) {
    console.error('Error updating user:', error);
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to update user';
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

// Delete a user by ID
export const deleteUser = (id) => async (dispatch) => {
  try {
    console.log('Deleting user with ID:', id);
    
    const response = await axios.delete(`${api.api}/api/v1/admin/user/${id}`);
    
    console.log('Delete user response:', response.data);
    
    if (response.data && response.data.success) {
      dispatch(deleteUserSuccess(id));
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to delete user'
      };
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to delete user';
    
    return {
      success: false,
      message: errorMessage
    };
  }
};