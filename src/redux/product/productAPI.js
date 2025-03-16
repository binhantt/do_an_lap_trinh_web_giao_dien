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
    const response = await axios.get(`${api.api}/api/v1/admin/products`);
    
    console.log('Fetch products response:', response.data);
    
    if (response.data && response.data.data && response.data.data.products && response.data.data.products.$values) {
      const products = response.data.data.products.$values || [];
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
    
    console.log('Create product response:', response.data);
    
    if (response.data && response.data.success) {
      const newProduct = response.data.data?.product || response.data.product;
      dispatch(createProductSuccess(newProduct));
      return {
        success: true,
        product: newProduct
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to create product'
      };
    }
  } catch (error) {
    console.error('Error creating product:', error);
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to create product';
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

// Update a product by ID
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    console.log('Updating product with ID:', id, 'Data:', productData);
    
    // Ensure the productData includes the "Category" field
    if (!productData.category) {
      throw new Error('The Category field is required.');
    }

    const response = await axios.put(`${api.api}/api/v1/admin/products/${id}`, productData);
    
    console.log('Update product response:', response.data);
    
    if (response.data && response.data.success) {
      const updatedProduct = response.data.data?.product || response.data.product;
      dispatch(updateProductSuccess(updatedProduct));
      return {
        success: true,
        product: updatedProduct,
        message: 'Product updated successfully'
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to update product'
      };
    }
  } catch (error) {
    console.error('Error updating product:', error);
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to update product';
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

// Delete a product by ID
export const deleteProduct = (id) => async (dispatch) => {
  try {
    console.log('Deleting product with ID:', id);
    
    const response = await axios.delete(`${api.api}/api/v1/admin/products/${id}`);
    
    console.log('Delete product response:', response.data);
    
    if (response.data && response.data.success) {
      dispatch(deleteProductSuccess(id));
      return {
        success: true,
        message: 'Product deleted successfully'
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to delete product'
      };
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to delete product';
    
    return {
      success: false,
      message: errorMessage
    };
  }
};