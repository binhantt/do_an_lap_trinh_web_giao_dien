import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { Card, Avatar, Typography, Tabs, Space, Button, Row, Col, Spin } from 'antd';
import { 
    UserOutlined, 
    LogoutOutlined, 
    ShoppingOutlined, 
    HeartOutlined,
    SettingOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/auth/authAPI';
import { fetchOrders } from '../../redux/order/orderAPI';
import { Table, Tag } from 'antd';
import LayoutUser from '../../components/layout/user/LayoutUser';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Profile = () => {
    const { name } = useParams();
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);
    
    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'orderDetails',
            key: 'products',
            render: (orderDetails) => (
                <Space direction="vertical">
                    {orderDetails?.$values?.map((detail, index) => (
                        <div key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px' 
                        }}>
                            <img 
                                src={detail.imageUrl} 
                                alt={detail.productName}
                                style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                }}
                            />
                            <div>
                                <Text>{detail.productName}</Text>
                            </div>
                        </div>
                    ))}
                </Space>
            ),
            onCell: (record) => ({
                onClick: () => navigate(`/order/${record.id}`)
            }),
            style: { cursor: 'pointer' }
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => `${amount?.toLocaleString()} VND`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={
                    status === 'Completed' ? 'success' :
                    status === 'Pending' ? 'processing' :
                    status === 'Cancelled' ? 'error' : 'default'
                }>
                    {status === 'Completed' ? 'Hoàn thành' :
                     status === 'Pending' ? 'Đang xử lý' :
                     status === 'Cancelled' ? 'Đã hủy' : status}
                </Tag>
            ),
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
    ];
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchOrders()).then(fetchedOrders => {
                // Filter orders for current user
                const userOrders = fetchedOrders.filter(order => order.userId === user.id);
                setOrders(userOrders);
            });
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    if (!user) {
        return (
            <LayoutUser>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            </LayoutUser>
        );
    }

    return (
        <LayoutUser>
            <div style={{ padding: '24px 60px' }}>
                <Row gutter={24}>
                    <Col span={6}>
                        <Card style={{ marginBottom: 24 }}>
                            <Space direction="vertical" align="center" style={{ width: '100%' }}>
                                <Avatar 
                                    size={100} 
                                    src={user.avatarUrl}
                                    icon={<UserOutlined />}
                                    style={{ 
                                        backgroundColor: '#ff6600',
                                        marginBottom: 16 
                                    }}
                                />
                                <Title level={4} style={{ margin: 0 }}>
                                    {user.fullName}
                                </Title>
                                <Text type="secondary">{user.email}</Text>
                            </Space>
                        </Card>

                        <Card>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button type="text" icon={<UserOutlined />} block>
                                    Thông tin cá nhân
                                </Button>
                                <Button type="text" icon={<ShoppingOutlined />} block>
                                    Đơn hàng của tôi
                                </Button>
                                <Button type="text" icon={<HeartOutlined />} block>
                                    Sản phẩm yêu thích
                                </Button>
                                <Button type="text" icon={<SettingOutlined />} block>
                                    Cài đặt tài khoản
                                </Button>
                                <Button 
                                    type="text" 
                                    danger
                                    icon={<LogoutOutlined />} 
                                    onClick={handleLogout}
                                    block
                                >
                                    Đăng xuất
                                </Button>
                            </Space>
                        </Card>
                    </Col>

                    <Col span={18}>
                        <Card>
                            <Tabs defaultActiveKey="info">
                                <TabPane tab="Thông tin cá nhân" key="info">
                                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                                        <div>
                                            <Text type="secondary">Họ và tên</Text>
                                            <div>{user.fullName}</div>
                                        </div>
                                        <div>
                                            <Text type="secondary">Email</Text>
                                            <div>{user.email}</div>
                                        </div>
                                        <div>
                                            <Text type="secondary">Số điện thoại</Text>
                                            <div>{user.phone || 'Chưa cập nhật'}</div>
                                        </div>
                                        <div>
                                            <Text type="secondary">Địa chỉ</Text>
                                            <div>{user.address || 'Chưa cập nhật'}</div>
                                        </div>
                                        <Button type="primary" style={{ backgroundColor: '#ff6600' }}>
                                            Cập nhật thông tin
                                        </Button>
                                    </Space>
                                </TabPane>
                                <TabPane tab="Đơn hàng" key="orders">
                                    {orders.length > 0 ? (
                                        <Table 
                                            columns={columns} 
                                            dataSource={orders}
                                            rowKey="id"
                                            pagination={{ pageSize: 5 }}
                                        />
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                            <HistoryOutlined style={{ fontSize: 48, color: '#ccc' }} />
                                            <Title level={4}>Chưa có đơn hàng nào</Title>
                                        </div>
                                    )}
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                </Row>
            </div>
        </LayoutUser>
    );
};

export default Profile;