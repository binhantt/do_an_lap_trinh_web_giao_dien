import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Typography, Card, message, Popconfirm, Row, Col, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/order/orderAPI';
import StatCard from '../../components/base/StatCard';

const { Title } = Typography;
const { Option } = Select;

const AdminOrders = () => {
    const dispatch = useDispatch();
    const ordersState = useSelector(state => state.orders) || { orders: [], loading: false };
    const { orders, loading } = ordersState;
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingOrder, setEditingOrder] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const showModal = (order = null) => {
        setEditingOrder(order);
        if (order) {
            form.setFieldsValue({
                orderId: order.orderId,
                customerName: order.customerName,
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
     console.log(orders);
    const filteredOrders = orders.filter(
        order => 
            order.orderId?.toLowerCase().includes(searchText.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
            order.status?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 80,
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
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

    return(
        <AdminLayout>
            {/* Summary Cards */}
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
                        pagination={{ pageSize: 4 }} // Set pagination to 4 items per page
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
                            <Form.Item
                                name="orderId"
                                label="Order ID"
                                rules={[{ required: true, message: 'Please enter order ID' }]}
                            >
                                <Input placeholder="Enter order ID" />
                            </Form.Item>
                            
                            <Form.Item
                                name="customerName"
                                label="Customer Name"
                                rules={[{ required: true, message: 'Please enter customer name' }]}
                            >
                                <Input placeholder="Enter customer name" />
                            </Form.Item>
                            
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: 'Please select a status' }]}
                            >
                                <Select placeholder="Select a status">
                                    <Option value="Completed">Completed</Option>
                                    <Option value="Pending">Pending</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="totalAmount"
                                label="Total Amount"
                                rules={[{ required: true, message: 'Please enter total amount' }]}
                            >
                                <Input placeholder="Enter total amount" type="number" />
                            </Form.Item>

                            <Form.Item
                                name="paymentMethod"
                                label="Payment Method"
                                rules={[{ required: true, message: 'Please enter payment method' }]}
                            >
                                <Input placeholder="Enter payment method" />
                            </Form.Item>

                            <Form.Item
                                name="paymentStatus"
                                label="Payment Status"
                                rules={[{ required: true, message: 'Please enter payment status' }]}
                            >
                                <Input placeholder="Enter payment status" />
                            </Form.Item>

                            <Form.Item
                                name="shippingAddress"
                                label="Shipping Address"
                                rules={[{ required: true, message: 'Please enter shipping address' }]}
                            >
                                <Input placeholder="Enter shipping address" />
                            </Form.Item>

                            <Form.Item
                                name="phoneNumber"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please enter phone number' }]}
                            >
                                <Input placeholder="Enter phone number" />
                            </Form.Item>
                            
                            <Form.Item style={{ textAlign: 'right' }}>
                                <Space>
                                    <Button onClick={() => setIsModalVisible(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        {editingOrder ? 'Update' : 'Create'}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;