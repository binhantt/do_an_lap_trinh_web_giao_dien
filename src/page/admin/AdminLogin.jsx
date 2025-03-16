import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin, checkAuthState } from '../../redux/auth/authAPI';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography, Divider, Spin } from 'antd';
import { UserOutlined, LockOutlined, ShopOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  
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
    setFormSubmitted(true);
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
    } finally {
      setFormSubmitted(false);
    }
  };
  
  if (isAuthenticated && isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spin size="large" tip="Redirecting to dashboard..." />
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <Card 
        className="w-96 shadow-lg rounded-lg overflow-hidden"
        bordered={false}
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <ShopOutlined style={{ fontSize: '28px' }} />
            </div>
          </div>
          <Title level={2} className="m-0">Admin Portal</Title>
          <Text type="secondary">Sign in to manage your store</Text>
        </div>
        
        <Divider className="my-4" />
        
        {error && (
          <Alert
            message="Authentication Failed"
            description={error}
            type="error"
            showIcon
            className="mb-6"
          />
        )}
        
        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon text-gray-400" />} 
              placeholder="Email" 
              className="py-2"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon text-gray-400" />}
              placeholder="Password"
              className="py-2"
            />
          </Form.Item>
          
          <Form.Item className="mb-2">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading || formSubmitted}
              className="w-full h-12 rounded-md font-medium text-base"
              style={{ background: '#1890ff' }}
            >
              {isLoading || formSubmitted ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>
        
        <div className="text-center mt-4">
          <Text type="secondary" className="text-sm">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;