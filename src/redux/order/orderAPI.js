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
    
    console.log('API Response:', response.data);
    
    if (response.data && response.data.data) {
      // Extract orders from the response
      const orders = response.data.data.orders.$values || [];
      dispatch(fetchOrdersSuccess(orders));
      return orders;
    } else {
      dispatch(fetchOrdersFailure('Failed to fetch orders'));
      return [];
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    dispatch(fetchOrdersFailure(error.message || 'Failed to fetch orders'));
    return [];
  }
};

// Create a new order
export const createOrder = (orderData) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:5284/api/admin/v1/order/create', orderData);
    
    if (response.data && response.data.success) {
      dispatch(createOrderSuccess(response.data.data.order));
      return response.data.data.order;
    } else {
      throw new Error('Failed to create order');
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

// Update an order
export const updateOrder = (id, orderData) => async (dispatch) => {
  try {
    const response = await axios.put(`${api.api}/api/admin/v1/order/${id}`, orderData);
    
    if (response.data && response.data.success) {
      dispatch(updateOrderSuccess(response.data.data.order));
      return response.data.data.order;
    }
    return null;
  } catch (error) {
    console.error('Error updating order:', error);
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
    console.error('Error deleting order:', error);
    return false;
  }
};