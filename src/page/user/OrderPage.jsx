import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, Typography, Descriptions, Alert } from 'antd';
import LayoutUser from '../../components/layout/user/LayoutUser';

const { Title } = Typography;

const OrderPage = () => {
    const { orderId } = useParams();
    const orders = useSelector(state => state.orders);
    const order = orders.find(order => order.id === orderId);

    if (!order) {
        return (
            <LayoutUser>
                <div style={{ padding: '24px' }}>
                    <Alert
                        message="Không tìm thấy đơn hàng"
                        type="error"
                        showIcon
                    />
                </div>
            </LayoutUser>
        );
    }

    return (
        <LayoutUser>
            <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
                <Card>
                    <Title level={2}>Chi tiết đơn hàng</Title>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Mã đơn hàng">{order.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên khách hàng">{order.customerName}</Descriptions.Item>
                        <Descriptions.Item label="Tổng tiền">{order.totalAmount?.toLocaleString()} VND</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">{order.status}</Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </LayoutUser>
    );
};

export default OrderPage;