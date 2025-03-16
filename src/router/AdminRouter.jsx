import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuthState } from '../redux/auth/authAPI';
import ProtectedRoute from '../components/layout/Protected';
import AdminLogin from '../page/admin/AdminLogin';
import AdminDashboard from '../page/admin/AdminDashboard';
import AdminCategories from '../page/admin/AdminCategories';
import AdminUsers from '../page/admin/AdminUsers';
import AdminOrders from '../page/admin/AdminOrders';

const AdminRouter = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);
  
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
        <Route path='/admin/dashboard/orders' element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
        <Route path='/admin/dashboard/customers' element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default AdminRouter;