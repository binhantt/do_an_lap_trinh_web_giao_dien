import axios from 'axios';
import api from '../../config/api';
import { 
  fetchOrdersStart, 
  fetchOrdersSuccess, 
  fetchOrdersFailure,
  createOrderSuccess,
  updateOrderSuccess,
  deleteOrderSuccess
} from './orderSlice';

// Fetch all orders
export const fetchOrders = () => async (dispatch) => {
  try {
    dispatch(fetchOrdersStart());
    const response = await axios.get(`${api.api}/api/admin/v1/order`);

    if (response.data && response.data.success) {
      // Make sure we're accessing the correct property in the response
      const orders = response.data.data.orders || [];
      console.log('Fetched orders:', orders); // Debug log
      dispatch(fetchOrdersSuccess(orders));
      return orders;
    } else {
      dispatch(fetchOrdersFailure(response.data.message || 'Failed to fetch orders'));
      return null;
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch orders. Please try again.';
    
    dispatch(fetchOrdersFailure(errorMessage));
    return null;
  }
};

// Update order status
export const updateOrderStatus = (id, status) => async (dispatch) => {
  try {
    const response = await axios.patch(`${api.api}/api/admin/v1/order/${id}/status`, { status });
    
    if (response.data && response.data.success) {
      dispatch(updateOrderSuccess(response.data.data.order));
      return response.data.data.order;
    }
    return null;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to update order status. Please try again.';
    console.error(errorMessage);
    return null;
  }
};

// Delete an order
export const deleteOrder = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(`${api.api}/api/admin/v1/order/${id}`);
    
    if (response.data && response.data.success) {
      dispatch(deleteOrderSuccess(id));
      return true;
    }
    return false;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Failed to delete order. Please try again.';
    
    console.error(errorMessage);
    return false;
  }
};