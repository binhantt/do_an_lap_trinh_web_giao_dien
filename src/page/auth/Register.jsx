import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/auth/authAPI';
import Navbar from '../../components/layout/user/Navbar';

const { Title, Text } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const success = await dispatch(registerUser({
                fullName: values.name,
                email: values.email,
                password: values.password,
                phoneNumber: values.phone
            }));
            if (success.success) {
                message.success('Đăng ký thành công!');
                navigate('/');
            } else {
                message.error(success.error || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            message.error('Đăng ký thất bại. Vui lòng thử lại.');
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
                        Đăng ký
                    </Title>
                    
                    <Form
                        name="register"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input 
                                prefix={<UserOutlined style={{ color: '#ff6600' }} />} 
                                placeholder="Họ và tên" 
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input 
                                prefix={<MailOutlined style={{ color: '#ff6600' }} />} 
                                placeholder="Email" 
                            />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                            ]}
                        >
                            <Input 
                                prefix={<PhoneOutlined style={{ color: '#ff6600' }} />} 
                                placeholder="Số điện thoại" 
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
                                Đăng ký
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            <Text type="secondary">Đã có tài khoản? </Text>
                            <Button 
                                type="link" 
                                onClick={() => navigate('/login')}
                                style={{ color: '#ff6600', fontWeight: 'bold' }}
                            >
                                Đăng nhập ngay
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Register;