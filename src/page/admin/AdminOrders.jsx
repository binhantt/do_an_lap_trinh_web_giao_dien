import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Typography, Card, message, Popconfirm, Row, Col, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, createOrder, updateOrder, deleteOrder } from '../../redux/order/orderAPI';
import StatCard from '../../components/base/StatCard';

const { Title } = Typography;
const { Option } = Select;

const AdminOrders = () => {
    const dispatch = useDispatch();
    const ordersState = useSelector(state => state.order) || { orders: [], loading: false };
    const { orders: rawOrders, loading } = ordersState;

    // Extract orders from the nested structure
    const orders = rawOrders || [];

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingOrder, setEditingOrder] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    console.log('Fetched orders:', orders); // Debug log

    const filteredOrders = orders.filter(
        order => 
            order.id.toString().includes(searchText.toLowerCase()) ||
            order.userName.toLowerCase().includes(searchText.toLowerCase()) ||
            order.status.toLowerCase().includes(searchText.toLowerCase())
    );

    const showModal = (order = null) => {
        setEditingOrder(order);
        if (order) {
            form.setFieldsValue({
                orderId: order.id,
                customerName: order.userName,
                status: order.status,
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                shippingAddress: order.shippingAddress,
                phoneNumber: order.phoneNumber
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        if (editingOrder) {
            const result = await dispatch(updateOrder(editingOrder.id, values));
            if (result) {
                message.success('Order updated successfully');
            } else {
                message.error('Failed to update order');
            }
        } else {
            const result = await dispatch(createOrder(values));
            if (result) {
                message.success('Order created successfully');
            } else {
                message.error('Failed to create order');
            }
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDelete = async (id) => {
        const result = await dispatch(deleteOrder(id));
        if (result) {
            message.success('Order deleted successfully');
        } else {
            message.error('Failed to delete order');
        }
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 80,
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
            width: 120,
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: text => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <span style={{ 
                    color: status === 'Completed' ? '#52c41a' : '#1890ff',
                    fontWeight: 'bold'
                }}>
                    {status}
                </span>
            ),
            filters: [
                { text: 'Completed', value: 'Completed' },
                { text: 'Pending', value: 'Pending' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: amount => `$${amount.toFixed(2)}`,
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
        },
        {
            title: 'Shipping Address',
            dataIndex: 'shippingAddress',
            key: 'shippingAddress',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: text => new Date(text).toLocaleDateString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => showModal(record)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this order?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            type="primary" 
                            danger 
                            icon={<DeleteOutlined />} 
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="px-6 pt-6 pb-4">
                <Row gutter={[16, 16]}>
                    {/* Add StatCard components for orders if needed */}
                </Row>
            </div>
            
            <div className="px-6 pb-6">
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <Title level={4}>Orders Management</Title>
                        <Space>
                            <Input
                                placeholder="Search orders"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                            />
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                onClick={() => showModal()}
                            >
                                Add Order
                            </Button>
                        </Space>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredOrders}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 4 }}
                    />

                    <Modal
                        title={editingOrder ? "Edit Order" : "Add New Order"}
                        open={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            {/* Form Items */}
                        </Form>
                    </Modal>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;