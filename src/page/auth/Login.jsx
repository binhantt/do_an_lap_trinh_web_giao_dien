import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/auth/authAPI';
import Navbar from '../../components/layout/user/Navbar';

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const result = await dispatch(loginUser(values));
            if (result.success) {
                message.success('Đăng nhập thành công!');
                navigate('/');
            } else {
                message.error('Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            message.error('Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Navbar />
            <div style={{
                minHeight: 'calc(100vh - 120px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px 20px'
            }}>
                <Card style={{ 
                    width: 400, 
                    padding: '30px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px'
                }}>
                    <Title level={2} style={{ 
                        textAlign: 'center', 
                        marginBottom: 30,
                        color: '#ff6600'
                    }}>
                        Đăng nhập
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
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input 
                                prefix={<UserOutlined style={{ color: '#ff6600' }} />} 
                                placeholder="Email" 
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined style={{ color: '#ff6600' }} />} 
                                placeholder="Mật khẩu" 
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block
                                loading={loading}
                                style={{ 
                                    backgroundColor: '#ff6600',
                                    height: '40px',
                                    fontSize: '16px'
                                }}
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            <Text type="secondary">Chưa có tài khoản? </Text>
                            <Button 
                                type="link" 
                                onClick={() => navigate('/register')}
                                style={{ color: '#ff6600', fontWeight: 'bold' }}
                            >
                                Đăng ký ngay
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Login;