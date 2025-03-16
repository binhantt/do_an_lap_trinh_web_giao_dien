import axios from 'axios';
import api from '../../config/api';
import { 
  fetchProductsStart, 
  fetchProductsSuccess, 
  fetchProductsFailure,
  createProductSuccess,
  updateProductSuccess,
  deleteProductSuccess
} from './productSlice';

// Fetch all products
export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(fetchProductsStart());
    const response = await axios.get(`${api.api}/api/admin/v1/product`);
    
    console.log('API Response:', response.data);
    
    if (response.data) {
      // Extract products from the response
      const products = response.data.products || [];
      dispatch(fetchProductsSuccess(products));
      return products;
    } else {
      dispatch(fetchProductsFailure('Failed to fetch products'));
      return [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    dispatch(fetchProductsFailure(error.message || 'Failed to fetch products'));
    return [];
  }
};

// Create a new product
export const createProduct = (productData) => async (dispatch) => {
  try {
    const response = await axios.post(`${api.api}/api/admin/v1/product`, productData);
    
    if (response.data && response.data.success) {
      dispatch(createProductSuccess(response.data.data.product));
      return response.data.data.product;
    }
    return null;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

// Update a product
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    const response = await axios.put(`${api.api}/api/admin/v1/product/${id}`, productData);
    
    if (response.data && response.data.success) {
      dispatch(updateProductSuccess(response.data.data.product));
      return response.data.data.product;
    }
    return null;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// Delete a product
export const deleteProduct = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(`${api.api}/api/admin/v1/product/${id}`);
    
    if (response.data && response.data.success) {
      dispatch(deleteProductSuccess(id));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};