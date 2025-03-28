import React from 'react';
import { Card, Typography, Descriptions, Table, Tag, Space, Button } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LayoutUser from '../../components/layout/user/LayoutUser';

const { Title } = Typography;

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const order = useSelector(state => 
        state.orders.orders.find(order => order.id === orderId)
    );

    const columns = [
        {
            title: 'Sản phẩm',
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
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: price => `${price.toLocaleString()} VND`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Tổng tiền',
            key: 'total',
            render: (_, record) => `${(record.price * record.quantity).toLocaleString()} VND`,
        },
    ];

    return (
        <LayoutUser>
            <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                <Card>
                    <Title level={2}>Chi tiết đơn hàng #{orderId}</Title>
                    
                    <Descriptions title="Thông tin đơn hàng" bordered>
                        <Descriptions.Item label="Ngày đặt hàng">
                            {new Date(order?.orderDate).toLocaleDateString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={order?.status === 'Completed' ? 'green' : 'blue'}>
                                {order?.status === 'Completed' ? 'Hoàn thành' : 'Đang xử lý'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng tiền">
                            {order?.totalAmount?.toLocaleString()} VND
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions title="Thông tin giao hàng" bordered style={{ marginTop: 24 }}>
                        <Descriptions.Item label="Họ và tên">
                            {order?.shippingDetails?.fullName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {order?.shippingDetails?.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {order?.shippingDetails?.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ" span={3}>
                            {order?.shippingDetails?.address}
                        </Descriptions.Item>
                    </Descriptions>

                    <Title level={4} style={{ marginTop: 24 }}>Danh sách sản phẩm</Title>
                    <Table 
                        columns={columns} 
                        dataSource={order?.items} 
                        pagination={false}
                        rowKey="id"
                    />

                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                        <Space>
                            <Link to="/orders">
                                <Button>Quay lại</Button>
                            </Link>
                            <Button type="primary">Tải hóa đơn</Button>
                        </Space>
                    </div>
                </Card>
            </div>
        </LayoutUser>
    );
};

export default OrderDetailPage;