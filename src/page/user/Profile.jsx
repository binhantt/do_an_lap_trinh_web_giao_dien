import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Avatar, Typography, Descriptions, Space, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/auth/authAPI';
import Navbar from '../../components/layout/user/Navbar';

const { Title } = Typography;

const Profile = () => {
    const { name } = useParams();
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (user && user.fullName !== name) {
            navigate(`/profile/${user.fullName}`);
        }
    }, [isAuthenticated, navigate, user, name]);
    
    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    if (!user) {
        return <div>Loading...</div>;
    }
    console.log(user);
    return (
        <div>
            <Navbar />
            <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
                <Card>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Avatar 
                                size={128} 
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#1890ff' }}
                            />
                            <Title level={2} style={{ marginTop: 16 }}>
                                {user.user.fullName}
                            </Title>
                            <Typography.Text type="secondary">
                                {user.user.role}
                            </Typography.Text>
                        </div>

                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="User ID">
                                {user.user.id}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {user.user.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Role">
                                {user.user.role}
                            </Descriptions.Item>
                        </Descriptions>

                        <Button 
                            type="primary" 
                            danger 
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            block
                        >
                            Logout
                        </Button>
                    </Space>
                </Card>
            </div>
        </div>
    );
};

export default Profile;