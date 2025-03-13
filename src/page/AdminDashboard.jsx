import React, { useEffect } from 'react';
import { Card, Statistic, notification } from 'antd';
import AdminLayout from '../components/admin/AdminLayout';

const AdminDashboard = () => {
  const showSuccessNotification = () => {
    notification.success({
      message: 'Login successful!',
      placement: 'topRight',
    });
  };

  useEffect(() => {
    // Only show notification if we just logged in (not on page reload)
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      showSuccessNotification();
      sessionStorage.removeItem('justLoggedIn');
    }
  }, []);

  return (
    <AdminLayout>
  
    </AdminLayout>
  );
};

export default AdminDashboard;
