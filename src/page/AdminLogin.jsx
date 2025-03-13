import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin, checkAuthState } from '../redux/auth/authAPI';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);
  
  // Check for existing token on component mount
  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);
  
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTimer = setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
      
      // Clean up timer if component unmounts
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (values) => {
    try {
      const result = await dispatch(loginAdmin({ 
        email: values.email, 
        password: values.password 
      }));
      
      if (result) {
        // Set a flag to show notification only on fresh login, not page reload
        sessionStorage.setItem('justLoggedIn', 'true');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-md">
        <div className="text-center mb-6">
          <Title level={2}>Admin Login</Title>
        </div>
        
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}
        
        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" />} 
              placeholder="Email" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              className="w-full"
              size="large"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;