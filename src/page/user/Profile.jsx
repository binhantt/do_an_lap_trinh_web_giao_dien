import React, { useState, useEffect } from 'react';
import { Card, Avatar, Tabs, Form, Input, Button, message, Spin } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const { TabPane } = Tabs;

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5284/api/v1/user/${user.id}`);
            if (response.data.success) {
                setUserData(response.data.data);
            }
        } catch (error) {
            message.error('Failed to fetch user profile');
        } finally {
            setLoading(false);
        }
    };

    const onUpdateProfile = async (values) => {
        try {
            setLoading(true);
            const response = await axios.put(`http://localhost:5284/api/v1/user/${user.id}`, {
                email: values.email,
                fullName: values.fullName
            });
            
            if (response.data.success) {
                message.success(response.data.message || 'Profile updated successfully');
                fetchUserProfile(); // Refresh user data
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !userData) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="profile-container">
            <Card className="profile-card">
                <div className="profile-header">
                    <Avatar 
                        size={100} 
                        icon={<UserOutlined />}
                    />
                    <h2>{userData?.fullName}</h2>
                    <p>{userData?.email}</p>
                    <p>Role: {userData?.role}</p>
                </div>

                <Tabs defaultActiveKey="1">
                    <TabPane tab="Profile Information" key="1">
                        <Form
                            layout="vertical"
                            initialValues={{
                                fullName: userData?.fullName,
                                email: userData?.email,
                                createdAt: new Date(userData?.createdAt).toLocaleDateString(),
                                updatedAt: new Date(userData?.updatedAt).toLocaleDateString()
                            }}
                            onFinish={onUpdateProfile}
                        >
                            <Form.Item
                                name="fullName"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Invalid email format!' }
                                ]}
                            >
                                <Input prefix={<MailOutlined />} disabled />
                            </Form.Item>

                            <Form.Item name="createdAt" label="Created At">
                                <Input disabled />
                            </Form.Item>

                            <Form.Item name="updatedAt" label="Last Updated">
                                <Input disabled />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block>
                                    Update Profile
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>

                    {/* ... rest of the password change tab remains the same ... */}
                </Tabs>
            </Card>
        </div>
    );
};

export default Profile;