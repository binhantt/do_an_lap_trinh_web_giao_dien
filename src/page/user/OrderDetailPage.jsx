import React from 'react';
import { Card, Typography, Descriptions, Table, Tag, Space, Button } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../components/layout/user/Navbar';

const { Title } = Typography;

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const order = useSelector(state => 
        state.orders.orders.find(order => order.id === orderId)
    );

    const columns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <img 
                        src={record.imageUrl} 
                        alt={text} 
                        style={{ width: 50, height: 50, objectFit: 'cover' }} 
                    />
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: price => `${price.toLocaleString()} VND`,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Total',
            key: 'total',
            render: (_, record) => `${(record.price * record.quantity).toLocaleString()} VND`,
        },
    ];

    return (
        <div>
            <Navbar />
            <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                <Card>
                    <Title level={2}>Order Details #{orderId}</Title>
                    
                    <Descriptions title="Order Information" bordered>
                        <Descriptions.Item label="Order Date">
                            {new Date(order?.orderDate).toLocaleDateString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag color={order?.status === 'Completed' ? 'green' : 'blue'}>
                                {order?.status}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Total Amount">
                            {order?.totalAmount?.toLocaleString()} VND
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions title="Shipping Information" bordered style={{ marginTop: 24 }}>
                        <Descriptions.Item label="Full Name">
                            {order?.shippingDetails?.fullName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone">
                            {order?.shippingDetails?.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {order?.shippingDetails?.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Address" span={3}>
                            {order?.shippingDetails?.address}
                        </Descriptions.Item>
                    </Descriptions>

                    <Title level={4} style={{ marginTop: 24 }}>Order Items</Title>
                    <Table 
                        columns={columns} 
                        dataSource={order?.items} 
                        pagination={false}
                        rowKey="id"
                    />

                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                        <Space>
                            <Link to="/orders">
                                <Button>Back to Orders</Button>
                            </Link>
                            <Button type="primary">Download Invoice</Button>
                        </Space>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default OrderDetailPage;