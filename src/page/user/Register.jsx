import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../redux/auth/authAPI';
import './Register.css';

const { Title, Text } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const result = await dispatch(registerUser(values));
            
            if (result.success) {
                message.success('Registration successful! Please login.');
                navigate('/login');
            } else {
                // Handle validation errors
                if (result.error && typeof result.error === 'object') {
                    const serverErrors = result.error;
                    const formErrors = {};
                    
                    // Convert server errors to form errors
                    Object.keys(serverErrors).forEach(field => {
                        formErrors[field] = {
                            name: field,
                            errors: Array.isArray(serverErrors[field]) 
                                ? serverErrors[field] 
                                : [serverErrors[field]]
                        };
                    });
                    
                    // Set form field errors
                    form.setFields(Object.values(formErrors));
                } else {
                    message.error(result.error || 'Registration failed');
                }
            }
        } catch (error) {
            message.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <Card className="register-card">
                <Title level={2} className="register-title">
                    Create Account
                </Title>

                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="fullName"
                        rules={[
                            { required: true, message: 'Please input your full name!' },
                            { min: 2, message: 'Name must be at least 2 characters!' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            placeholder="Full Name" 
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input 
                            prefix={<MailOutlined />} 
                            placeholder="Email" 
                        />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        rules={[
                            { required: true, message: 'Please input your phone number!' },
                            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid phone number!' }
                        ]}
                    >
                        <Input 
                            prefix={<PhoneOutlined />} 
                            placeholder="Phone Number" 
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
                            Register
                        </Button>
                    </Form.Item>

                    <div className="register-footer">
                        <Text>Already have an account?</Text>
                        <Link to="/login">Login now</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;