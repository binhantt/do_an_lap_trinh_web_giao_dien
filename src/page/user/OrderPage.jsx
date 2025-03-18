import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, Typography, Descriptions } from 'antd';
import Navbar from '../../components/layout/user/Navbar';

const { Title } = Typography;

const OrderPage = () => {
    const { orderId } = useParams();
    const orders = useSelector(state => state.orders); // Assuming orders are stored in Redux
    const order = orders.find(order => order.id === orderId);

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div>
            <Navbar />
            <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
                <Card>
                    <Title level={2}>Order Details</Title>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Order ID">{order.id}</Descriptions.Item>
                        <Descriptions.Item label="Customer Name">{order.customerName}</Descriptions.Item>
                        <Descriptions.Item label="Total Amount">{order.totalAmount}</Descriptions.Item>
                        <Descriptions.Item label="Status">{order.status}</Descriptions.Item>
                        {/* Add more order details as needed */}
                    </Descriptions>
                </Card>
            </div>
        </div>
    );
};

export default OrderPage;