import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../redux/auth/authAPI';
import './Login.css';

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    useEffect(() => {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('user');
        if (savedUser && isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const loginData = {
                email: values.email,
                password: values.password
            };
            
            const success = await dispatch(loginUser(loginData));
            if (success) {
                message.success('Welcome back!');
                navigate('/');
            } else {
                message.error('Invalid credentials');
            }
        } catch (error) {
            message.error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Title level={2} className="login-title">
                    User Login
                </Title>

                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="Email" 
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined />} 
                            placeholder="Password" 
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block
                            loading={loading}
                        >
                            Log in
                        </Button>
                    </Form.Item>

                    <div className="login-footer">
                        <Text>Don't have an account?</Text>
                        <Link to="/register">Register now</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;