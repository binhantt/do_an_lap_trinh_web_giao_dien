import axios from 'axios';
import api from '../../config/api';
import { 
  fetchCategoriesStart, 
  fetchCategoriesSuccess, 
  fetchCategoriesFailure,
  createCategorySuccess,
  updateCategorySuccess,
  deleteCategorySuccess
} from './categorySlice';

// Fetch all categories
export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch(fetchCategoriesStart());
    const response = await axios.get(`${api.api}/api/admin/v1/category`);

    if (response.data && response.data.success) {
      dispatch(fetchCategoriesSuccess(response.data.data.categories));
      return response.data.data.categories;
    } else {
      dispatch(fetchCategoriesFailure(response.data.message || 'Failed to fetch categories'));
      return null;
    }
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch categories. Please try again.';
    
    dispatch(fetchCategoriesFailure(errorMessage));
    return null;
  }
};

export const createCategory = (categoryData) => async (dispatch) => {
  try {
    const response = await axios.post(`${api.api}/api/admin/v1/category`, categoryData);
    
    if (response.data && response.data.success) {
      dispatch(createCategorySuccess(response.data.data.category));
      return response.data.data.category;
    }
    return null;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to create category. Please try again.';
    
    console.error(errorMessage);
    return null;
  }
};
export const updateCategory = (id, categoryData) => async (dispatch) => {
  try {
    const response = await axios.put(`${api.api}/api/admin/v1/category/${id}`, categoryData);
    
    if (response.data && response.data.success) {
      dispatch(updateCategorySuccess(response.data.data.category));
      return response.data.data.category;
    }
    return null;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to update category. Please try again.';
    console.error(errorMessage);
    return null;
  }
};

// Delete a category
export const deleteCategory = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(`${api.api}/api/admin/v1/category/${id}`);
    
    if (response.data && response.data.success) {
      dispatch(deleteCategorySuccess(id));
      return true;
    }
    return false;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to delete category. Please try again.';
    
    console.error(errorMessage);
    return false;
  }
};